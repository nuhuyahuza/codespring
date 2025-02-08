interface YouTubeVideoDetails {
  duration: number;
  thumbnail: string;
  title: string;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export async function getYoutubeVideoDetails(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails,snippet`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('YouTube API error:', error);
      throw new Error(error.error?.message || 'Failed to fetch video details');
    }

    const data = await response.json();
    if (!data.items?.[0]) {
      throw new Error('Video not found');
    }

    const video = data.items[0];
    const duration = parseDuration(video.contentDetails.duration);
    
    return {
      duration,
      thumbnail: video.snippet.thumbnails.high.url,
      title: video.snippet.title,
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const [, hours, minutes, seconds] = match;
  return (
    (parseInt(hours || '0') * 3600) +
    (parseInt(minutes || '0') * 60) +
    parseInt(seconds || '0')
  );
} 