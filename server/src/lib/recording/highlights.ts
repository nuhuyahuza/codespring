import { SpeechClient } from '@google-cloud/speech';
import { VideoIntelligenceClient } from '@google-cloud/video-intelligence';

interface Highlight {
  startTime: number;
  endTime: number;
  type: 'speech' | 'action' | 'slide';
  confidence: number;
  description: string;
}

export async function detectHighlights(videoBuffer: Buffer): Promise<Highlight[]> {
  const highlights: Highlight[] = [];

  // Initialize clients
  const speechClient = new SpeechClient();
  const videoIntelligence = new VideoIntelligenceClient();

  // Detect speech segments
  const audioBuffer = await extractAudio(videoBuffer);
  const speechHighlights = await detectSpeechHighlights(audioBuffer, speechClient);
  highlights.push(...speechHighlights);

  // Detect action segments
  const actionHighlights = await detectActionHighlights(videoBuffer, videoIntelligence);
  highlights.push(...actionHighlights);

  // Detect slide changes
  const slideHighlights = await detectSlideChanges(videoBuffer, videoIntelligence);
  highlights.push(...slideHighlights);

  // Sort highlights by start time
  return highlights.sort((a, b) => a.startTime - b.startTime);
}

async function detectSpeechHighlights(
  audioBuffer: Buffer,
  client: SpeechClient
): Promise<Highlight[]> {
  const [response] = await client.recognize({
    audio: { content: audioBuffer.toString('base64') },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableWordTimeOffsets: true,
      enableAutomaticPunctuation: true,
    },
  });

  return response.results!.map((result) => ({
    startTime: Number(result.resultStartTime!.seconds),
    endTime: Number(result.resultEndTime!.seconds),
    type: 'speech',
    confidence: result.alternatives![0].confidence!,
    description: result.alternatives![0].transcript!,
  }));
}

async function detectActionHighlights(
  videoBuffer: Buffer,
  client: VideoIntelligenceClient
): Promise<Highlight[]> {
  const [operation] = await client.annotateVideo({
    inputContent: videoBuffer.toString('base64'),
    features: ['LABEL_DETECTION'],
    videoContext: {
      labelDetectionConfig: {
        labelDetectionMode: 'SHOT_MODE',
      },
    },
  });

  const [response] = await operation.promise();
  const labels = response.annotationResults![0].shotLabelAnnotations!;

  return labels.map((label) => ({
    startTime: Number(label.segments![0].startTimeOffset!.seconds),
    endTime: Number(label.segments![0].endTimeOffset!.seconds),
    type: 'action',
    confidence: label.segments![0].confidence!,
    description: label.entity!.description!,
  }));
}

async function detectSlideChanges(
  videoBuffer: Buffer,
  client: VideoIntelligenceClient
): Promise<Highlight[]> {
  const [operation] = await client.annotateVideo({
    inputContent: videoBuffer.toString('base64'),
    features: ['SHOT_CHANGE_DETECTION'],
  });

  const [response] = await operation.promise();
  const shots = response.annotationResults![0].shotAnnotations!;

  return shots.map((shot) => ({
    startTime: Number(shot.startTimeOffset!.seconds),
    endTime: Number(shot.endTimeOffset!.seconds),
    type: 'slide',
    confidence: 1.0,
    description: 'Slide change detected',
  }));
} 