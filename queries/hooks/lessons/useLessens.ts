// import { useQuery } from '@tanstack/react-query';

// import { api } from '~/services/api';
// import { useAuthStore } from '~/store/authStore';

// export function useLessons() {
//   const token = useAuthStore((state) => state.userToken);

//   return useQuery({
//     queryKey: ['lessons'],
//     queryFn: async () => {
//       const { data } = await api.get('/lessons');
//       return data;
//     },
//     enabled: !!token,
//   });
// }
