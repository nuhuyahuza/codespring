import { Router, Request, Response, RequestHandler } from 'express';
import { extractVideoId, getYoutubeVideoDetails } from '../utils/youtube';
import multer from 'multer';
import { VideoProcessor } from '../services/VideoProcessor';
import path from 'path';
import fs from 'fs/promises';

const router = Router();
const SERVER_URL = process.env.VITE_API_URL || 'http://localhost:5000';

// Configure storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
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

    // Generate video URL with full server URL
    const videoUrl = `${SERVER_URL}/uploads/videos/${file.filename}`;
    const thumbnailUrl = `${SERVER_URL}/uploads/thumbnails/${path.parse(file.filename).name}.jpg`;

    // Return the URLs
    res.json({
      url: videoUrl,
      thumbnail: thumbnailUrl,
      duration: 0, // You can implement duration extraction if needed
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
};

router.post('/upload', (upload.single('file') as unknown) as RequestHandler, handleVideoUpload);

export default router; 