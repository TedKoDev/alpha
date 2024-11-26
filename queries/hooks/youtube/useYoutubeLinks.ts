import { useQuery } from '@tanstack/react-query';

import { youtubeService } from '~/services/youtubeService';

// videoId 추출 유틸 함수
const getYoutubeVideoId = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

export interface YoutubeItem {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  channelId: string;
  thumbnail: string;
}

const CHANNEL_INFO = {
  id: 'UCnV92PH-m2oxVD-jXIggNkQ',
  name: '베라한국어-BelaKorean',
};

export const useYoutubeLinks = () => {
  return useQuery({
    queryKey: ['youtube', 'links'],
    queryFn: async () => {
      const data = await youtubeService.getAllLinks();

      const uniqueLinks = Array.from(new Set(data.map((item) => item.link)));

      return uniqueLinks.map((link, index): YoutubeItem => {
        const videoId = getYoutubeVideoId(link);
        return {
          id: `${videoId}-${index}`,
          videoId,
          title: '카페 재즈',
          channel: CHANNEL_INFO.name,
          channelId: CHANNEL_INFO.id,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        };
      });
    },
  });
};

export const useRandomYoutubeLink = () => {
  return useQuery({
    queryKey: ['youtube', 'random'],
    queryFn: async () => {
      const data = await youtubeService.getRandomLink();
      const videoId = getYoutubeVideoId(data.link);

      return {
        id: videoId,
        videoId,
        title: '카페 재즈',
        channel: CHANNEL_INFO.name,
        channelId: CHANNEL_INFO.id,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    },
  });
};
