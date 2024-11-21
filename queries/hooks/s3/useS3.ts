import { useMutation, useQuery } from '@tanstack/react-query';

import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';

export function usePresignedUrl(fileName?: string, fileType?: string) {
  return useQuery({
    queryKey: ['presignedUrl', fileName, fileType],
    queryFn: () => getPresignedUrlApi(fileName!, fileType!),
    enabled: !!fileName && !!fileType,
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ url, file }: { url: string; file: File | Blob }) => uploadFileToS3(url, file),
  });
}
