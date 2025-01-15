import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import { NoiseSuppressionProcessor } from './NoiseSuppressionProcessor';

export class VideoEffects {
  private bodyPixModel: bodyPix.BodyPix | null = null;
  private virtualBackground: HTMLImageElement | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private noiseSuppressionNode: AudioWorkletNode | null = null;

  constructor(private audioContext: AudioContext) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async initialize() {
    // Load BodyPix model
    this.bodyPixModel = await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    });

    // Add noise suppression worklet
    await this.audioContext.audioWorklet.addModule(
      '/worklets/noise-suppression-processor.js'
    );
  }

  async setVirtualBackground(imageUrl: string) {
    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve) => (img.onload = resolve));
    this.virtualBackground = img;
  }

  async processVideoFrame(inputFrame: HTMLVideoElement): Promise<ImageData> {
    if (!this.bodyPixModel || !this.virtualBackground) {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    // Get person segmentation
    const segmentation = await this.bodyPixModel.segmentPerson(inputFrame);

    // Draw virtual background
    this.ctx.drawImage(this.virtualBackground, 0, 0, this.canvas.width, this.canvas.height);

    // Get original frame data
    const originalFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const frameData = originalFrame.data;

    // Apply segmentation mask
    for (let i = 0; i < segmentation.data.length; i++) {
      const pixelIndex = i * 4;
      if (segmentation.data[i] === 1) {
        // Keep person pixels
        frameData[pixelIndex] = inputFrame.data[pixelIndex];
        frameData[pixelIndex + 1] = inputFrame.data[pixelIndex + 1];
        frameData[pixelIndex + 2] = inputFrame.data[pixelIndex + 2];
        frameData[pixelIndex + 3] = inputFrame.data[pixelIndex + 3];
      }
    }

    return new ImageData(frameData, this.canvas.width, this.canvas.height);
  }

  enableNoiseSuppression(sourceNode: AudioNode) {
    this.noiseSuppressionNode = new AudioWorkletNode(
      this.audioContext,
      'noise-suppression-processor'
    );

    sourceNode.disconnect();
    sourceNode
      .connect(this.noiseSuppressionNode)
      .connect(this.audioContext.destination);
  }

  disableNoiseSuppression(sourceNode: AudioNode) {
    if (this.noiseSuppressionNode) {
      sourceNode.disconnect();
      this.noiseSuppressionNode.disconnect();
      sourceNode.connect(this.audioContext.destination);
      this.noiseSuppressionNode = null;
    }
  }
} 