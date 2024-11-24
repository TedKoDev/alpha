import { api } from './api';

interface CountryResponse {
  status: string;
  data: any[]; // 실제 country 타입으로 수정하는 것이 좋습니다
}

export const getCountryListApi = async () => {
  try {
    const response = await api.get('/country/list'); // 또는 '/country'
    if (response.data.status === 'success') {
      return response.data.data; // 실제 국가 데이터 배열 반환
    }
    throw new Error(response.data.message || '국가 목록을 가져오는데 실패했습니다');
  } catch (error) {
    console.error('국가 목록 조회 실패:', error);
    throw error;
  }
};
export const loginApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    //console.log('Login success', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const registerApi = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    //console.log('Register success', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Register failed', error);
    if (error.response?.status === 409) {
      throw new Error(
        'This email is already registered. Please try with a different email address or log in if you already have an account.'
      );
    }
    throw new Error(
      'Registration failed. Please check your information and try again. If the problem persists, please contact our support team.'
    );
  }
};

export const checkEmail = async (email: string): Promise<boolean> => {
  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const checkName = async (name: string): Promise<boolean> => {
  // 이름 길이 검증 (2글자 이상)
  return name.length >= 2;
};

export const getUserInfoApi = async (token: string) => {
  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('getUserInfoApi error details:', (error as any).response?.data);
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

export const updateUserProfileApi = async (token: string, updateData: any) => {
  try {
    // console.log('API request data:', updateData);
    const response = await api.post('/users/update-profile', updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // console.log('API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update profile API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const authService = {
  checkEmail,
  checkName,
  loginApi,
  registerApi,
  getUserInfoApi,
  updateUserProfileApi,
};
