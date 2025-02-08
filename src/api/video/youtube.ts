import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

import { extractVideoId, getYoutubeVideoDetails } from '../../../server/src/utils/youtube';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

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

export default router.handler(); 