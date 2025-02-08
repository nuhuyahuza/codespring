import { Router, Request, Response, RequestHandler } from 'express';
import { extractVideoId, getYoutubeVideoDetails } from '../utils/youtube';
import multer from 'multer';
import { VideoProcessor } from '../services/VideoProcessor';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
});

// YouTube video processing endpoint
router.post('/youtube', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const details = await getYoutubeVideoDetails(videoId);
    res.json(details);
  } catch (error) {
    console.error('YouTube processing error:', error);
    res.status(500).json({ error: 'Failed to process YouTube video' });
  }
});

// Video upload endpoint
const handleVideoUpload: RequestHandler = async (req, res) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const videoProcessor = VideoProcessor.getInstance();
    const optimizedVideo = await videoProcessor.optimizeVideo(new File([file.buffer], file.originalname));
    const thumbnail = await videoProcessor.generateThumbnail(new File([file.buffer], file.originalname));

    // For now, we'll return temporary URLs. In production, you'd upload these to cloud storage
    const videoUrl = URL.createObjectURL(optimizedVideo);
    const thumbnailUrl = thumbnail;

    const metadata = await videoProcessor.processVideoUrl(videoUrl);

    res.json({
      url: videoUrl,
      thumbnail: thumbnailUrl,
      duration: metadata.duration,
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
};

router.post('/upload', (upload.single('file') as unknown) as RequestHandler, handleVideoUpload);

export default router; 