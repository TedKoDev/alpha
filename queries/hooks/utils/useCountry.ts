import { useQuery } from '@tanstack/react-query';

import { getCountryListApi } from '~/services/authService';

export const useCountry = () => {
  return useQuery({
    queryKey: ['country'],
    queryFn: () => getCountryListApi(),
  });
};
