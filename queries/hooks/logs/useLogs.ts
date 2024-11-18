import { useQuery } from '@tanstack/react-query';

import { getlogsApi, logsParams } from '~/services/logsService';

export const useLogs = (params?: logsParams) => {
  return useQuery({
    queryKey: ['logs', params?.type],
    queryFn: () => getlogsApi(params),
    enabled: !!params?.type,
  });
};
