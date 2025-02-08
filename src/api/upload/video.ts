import { VideoProcessor } from './../../../server/src/services/VideoProcessor';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import multer from 'multer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { uploadToStorage } from '../../lib/storage';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
});

const router = createRouter<NextApiRequest & { file: Express.Multer.File }, NextApiResponse>();

router
  .use((req: NextApiRequest & { file: Express.Multer.File }, res: NextApiResponse, next: () => void) => {
    upload.single('file')(req as any, res as any, next);
  })
  .post(async (req, res) => {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Process video
      const videoProcessor = VideoProcessor.getInstance();
      const optimizedVideo = await videoProcessor.optimizeVideo(new File([file.buffer], file.originalname));
      const thumbnail = await videoProcessor.generateThumbnail(new File([file.buffer], file.originalname));

      // Upload to storage
      const videoUrl = await uploadToStorage(optimizedVideo, {
        fileName: `${Date.now()}-${file.originalname}`,
        contentType: file.mimetype,
        folder: 'videos',
      });

      const thumbnailUrl = await uploadToStorage(Buffer.from(thumbnail), {
        fileName: `${Date.now()}-thumbnail.jpg`,
        contentType: 'image/jpeg',
        folder: 'thumbnails',
      });

      // Get video duration
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
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();