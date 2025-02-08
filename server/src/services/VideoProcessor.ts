import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { extractVideoId, getYoutubeVideoDetails } from '../utils/youtube';

type VideoProvider = 'YOUTUBE' | 'LOCAL';

interface VideoMetadata {
  duration: number;
  thumbnail?: string;
  provider: VideoProvider;
  metadata?: Record<string, any>;
}

export class VideoProcessor {
  private static instance: VideoProcessor;
  private ffmpeg: FFmpeg;

  private constructor() {
    this.ffmpeg = new FFmpeg();
  }

  public static getInstance(): VideoProcessor {
    if (!VideoProcessor.instance) {
      VideoProcessor.instance = new VideoProcessor();
    }
    return VideoProcessor.instance;
  }

  async init() {
    if (!this.ffmpeg.loaded) {
      await this.ffmpeg.load();
    }
  }

  async processVideoUrl(url: string): Promise<VideoMetadata> {
    // Check if it's a YouTube URL
    const youtubeId = extractVideoId(url);
    if (youtubeId) {
      return this.processYoutubeVideo(youtubeId);
    }

    // Handle direct video URL
    return this.processDirectVideo(url);
  }

  private async processYoutubeVideo(videoId: string): Promise<VideoMetadata> {
    const details = await getYoutubeVideoDetails(videoId);
    return {
      duration: details.duration,
      thumbnail: details.thumbnail,
      provider: 'YOUTUBE',
      metadata: {
        videoId,
        title: details.title,
      },
    };
  }

  private async processDirectVideo(url: string): Promise<VideoMetadata> {
    const duration = await getVideoDurationInSeconds(url);
    return {
      duration: Math.round(duration),
      provider: 'LOCAL',
      metadata: {
        originalUrl: url,
      },
    };
  }

  async generateThumbnail(file: File): Promise<string> {
    await this.init();
    
    const videoData = await fetchFile(file);
    await this.ffmpeg.writeFile('input.mp4', videoData);
    
    // Extract frame at 1 second
    await this.ffmpeg.exec([
      '-i', 'input.mp4',
      '-ss', '00:00:01.000',
      '-vframes', '1',
      'thumbnail.jpg'
    ]);
    
    const thumbnailData = await this.ffmpeg.readFile('thumbnail.jpg');
    const thumbnailBlob = new Blob([thumbnailData], { type: 'image/jpeg' });
    
    // Clean up
    await this.ffmpeg.deleteFile('input.mp4');
    await this.ffmpeg.deleteFile('thumbnail.jpg');
    
    return URL.createObjectURL(thumbnailBlob);
  }

  async optimizeVideo(file: File): Promise<Blob> {
    await this.init();
    
    const videoData = await fetchFile(file);
    await this.ffmpeg.writeFile('input.mp4', videoData);
    
    // Optimize video for web streaming
    await this.ffmpeg.exec([
      '-i', 'input.mp4',
      '-c:v', 'libx264',
      '-crf', '23',
      '-preset', 'medium',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      'output.mp4'
    ]);
    
    const outputData = await this.ffmpeg.readFile('output.mp4');
    const outputBlob = new Blob([outputData], { type: 'video/mp4' });
    
    // Clean up
    await this.ffmpeg.deleteFile('input.mp4');
    await this.ffmpeg.deleteFile('output.mp4');
    
    return outputBlob;
  }
}