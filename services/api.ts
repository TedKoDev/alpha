import axios from 'axios';

const API_BASE_URL = 'http://192.168.219.107:3000/api/v1/';

// 공통 API 요청 함수
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
