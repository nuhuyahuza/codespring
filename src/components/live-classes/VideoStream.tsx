import { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, MicOff, Video, VideoOff, Share, StopCircle, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { VideoStreamControls } from './VideoStreamControls';

interface VideoStreamProps {
  roomId: string;
  isInstructor?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export function VideoStream({ roomId, isInstructor = false, onStartRecording, onStopRecording }: VideoStreamProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  useEffect(() => {
    initializeStream();
    return () => {
      cleanupStream();
    };
  }, []);

  useEffect(() => {
    if (!localStream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(localStream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationFrame: number;
    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      if (average > 30) { // Adjust threshold as needed
        wsClient.send({
          type: 'speaking',
          roomId,
          data: { userId: user!.id, isSpeaking: true },
        });
      }

      animationFrame = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();

    return () => {
      cancelAnimationFrame(animationFrame);
      audioContext.close();
    };
  }, [localStream]);

  const initializeStream = async () => {
    try {
      // Create WebRTC peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add your TURN server configuration here
        ],
      });

      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Display local stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      // Handle incoming tracks
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Connect to signaling server
      connectToSignalingServer();
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing stream:', error);
      toast.error('Failed to initialize video stream. Please check your camera and microphone permissions.');
      setIsLoading(false);
    }
  };

  const connectToSignalingServer = () => {
    // Connect to your WebSocket signaling server
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/rtc`);

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'offer':
          if (!isInstructor) {
            await handleOffer(message.offer);
          }
          break;
        case 'answer':
          if (isInstructor) {
            await handleAnswer(message.answer);
          }
          break;
        case 'ice-candidate':
          await handleIceCandidate(message.candidate);
          break;
      }
    };

    // Handle ICE candidates
    peerConnection.current!.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          roomId,
        }));
      }
    };

    // Create and send offer if instructor
    if (isInstructor) {
      createAndSendOffer(ws);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);

      // Send answer to signaling server
      ws.send(JSON.stringify({
        type: 'answer',
        answer,
        roomId,
      }));
    } catch (error) {
      console.error('Error handling offer:', error);
      toast.error('Failed to connect to stream.');
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      toast.error('Failed to establish connection.');
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const createAndSendOffer = async (ws: WebSocket) => {
    try {
      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      ws.send(JSON.stringify({
        type: 'offer',
        offer,
        roomId,
      }));
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Failed to start stream.');
    }
  };

  const cleanupStream = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnection.current?.close();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      setScreenStream(stream);
      setIsScreenSharing(true);

      // Replace video track in peer connection
      const videoTrack = stream.getVideoTracks()[0];
      const senders = peerConnection.current?.getSenders();
      const videoSender = senders?.find(sender => 
        sender.track?.kind === 'video'
      );
      
      if (videoSender) {
        videoSender.replaceTrack(videoTrack);
      }

      // Update local video display
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Handle stream end
      videoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast.error('Failed to start screen sharing');
    }
  };

  const stopScreenShare = async () => {
    try {
      screenStream?.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);

      // Restore camera video track
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        const senders = peerConnection.current?.getSenders();
        const videoSender = senders?.find(sender => 
          sender.track?.kind === 'video'
        );
        
        if (videoSender) {
          videoSender.replaceTrack(videoTrack);
        }

        // Update local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      }
    } catch (error) {
      console.error('Error stopping screen share:', error);
      toast.error('Failed to stop screen sharing');
    }
  };

  const startRecording = () => {
    try {
      const stream = remoteVideoRef.current?.srcObject as MediaStream;
      if (!stream) return;

      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      onStartRecording?.();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    try {
      mediaRecorder.current?.stop();
      setIsRecording(false);
      onStopRecording?.();
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Failed to stop recording');
    }
  };

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality);
    
    // Get current video sender
    const videoSender = peerConnection.current?.getSenders().find(sender => 
      sender.track?.kind === 'video'
    );

    if (videoSender) {
      const parameters = videoSender.getParameters();
      
      // Set encoding parameters based on quality
      const encodings = parameters.encodings || [{}];
      switch (quality) {
        case '1080p':
          encodings[0].maxBitrate = 2500000; // 2.5 Mbps
          encodings[0].scaleResolutionDownBy = 1;
          break;
        case '720p':
          encodings[0].maxBitrate = 1500000; // 1.5 Mbps
          encodings[0].scaleResolutionDownBy = 1.5;
          break;
        case '480p':
          encodings[0].maxBitrate = 800000; // 800 Kbps
          encodings[0].scaleResolutionDownBy = 2;
          break;
        case '360p':
          encodings[0].maxBitrate = 500000; // 500 Kbps
          encodings[0].scaleResolutionDownBy = 3;
          break;
        case 'Auto':
          // Remove restrictions
          delete encodings[0].maxBitrate;
          delete encodings[0].scaleResolutionDownBy;
          break;
      }

      parameters.encodings = encodings;
      videoSender.setParameters(parameters);
    }
  };

  const handleParticipantAction = async (participantId: string, action: 'mute' | 'hide') => {
    try {
      await api.post(`/student/live-classes/${roomId}/participants/${participantId}/${action}`);
      toast.success(`Participant ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing participant:`, error);
      toast.error(`Failed to ${action} participant`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <VideoStreamControls
        participants={participants}
        currentQuality={currentQuality}
        onQualityChange={handleQualityChange}
        onParticipantAction={handleParticipantAction}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Remote video (full size for students, half for instructor) */}
        <div className={`relative ${isInstructor ? 'col-span-1' : 'col-span-full'}`}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          />
          {isInstructor && <div className="absolute bottom-4 left-4 text-white">Remote Stream</div>}
        </div>

        {/* Local video (small for students, half for instructor) */}
        <div className={`relative ${
          isInstructor ? 'col-span-1' : 'absolute bottom-4 right-4 w-48'
        }`}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-4 left-4 text-white">
            {isInstructor ? 'Local Stream' : 'You'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleMute}
          className={isMuted ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleVideo}
          className={isVideoOff ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          className={isScreenSharing ? 'bg-primary hover:bg-primary/90' : ''}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        {isInstructor && (
          <Button
            variant="secondary"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {isRecording ? <StopCircle className="h-4 w-4" /> : <Share className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
} 