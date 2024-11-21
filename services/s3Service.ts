import { api } from './api';

interface GetPresignedUrlResponse {
  url: string;
}

export const getPresignedUrlApi = async (fileName: string, fileType: string) => {
  try {
    const response = await api.get<GetPresignedUrlResponse>('/s3/presigned-url', {
      params: {
        fileName,
        fileType,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get presigned URL:', error);
    throw error;
  }
};

export const uploadFileToS3 = async (presignedUrl: string, file: File | Blob) => {
  try {
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error) {
    console.error('Failed to upload file to S3:', error);
    throw error;
  }
};

export const s3Service = {
  getPresignedUrl: getPresignedUrlApi,
  uploadFile: uploadFileToS3,
};
