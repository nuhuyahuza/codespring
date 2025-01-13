import { Storage } from '@google-cloud/storage';
import { SpeechClient } from '@google-cloud/speech';
import ffmpeg from 'fluent-ffmpeg';
import { prisma } from './prisma';

const storage = new Storage();
const speechClient = new SpeechClient();
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);

export async function processRecording(
  fileBuffer: Buffer,
  liveClassId: string,
  userId: string
) {
  try {
    // Upload to cloud storage
    const fileName = `recordings/${liveClassId}/${Date.now()}.webm`;
    const file = bucket.file(fileName);
    await file.save(fileBuffer);

    // Make file public
    await file.makePublic();
    const publicUrl = file.publicUrl();

    // Convert to audio for transcription
    const audioBuffer = await convertToAudio(fileBuffer);

    // Transcribe audio
    const transcript = await transcribeAudio(audioBuffer);

    // Save recording details to database
    const recording = await prisma.liveClassRecording.create({
      data: {
        liveClassId,
        recordedById: userId,
        fileUrl: publicUrl,
        transcript,
        duration: await getVideoDuration(fileBuffer),
      },
    });

    return recording;
  } catch (error) {
    console.error('Error processing recording:', error);
    throw error;
  }
}

async function convertToAudio(videoBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    ffmpeg()
      .input(videoBuffer)
      .toFormat('wav')
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject)
      .run();
  });
}

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const audio = {
    content: audioBuffer.toString('base64'),
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    enableAutomaticPunctuation: true,
  };

  const request = {
    audio,
    config,
  };

  const [response] = await speechClient.recognize(request);
  return response.results
    ?.map(result => result.alternatives?.[0]?.transcript)
    .filter(Boolean)
    .join('\n') ?? '';
}

async function getVideoDuration(videoBuffer: Buffer): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoBuffer, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata.format.duration ?? 0);
    });
  });
} 