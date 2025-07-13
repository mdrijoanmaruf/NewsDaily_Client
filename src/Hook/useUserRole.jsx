import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';
import useAuth from './useAuth';

const useUserRole = () => {
  const axios = useAxios();
  const { user } = useAuth();

  const { data: userRole, isLoading, error, refetch } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      if (!user?.email) {
        return null;
      }
      
      const response = await axios.get(`/api/users/${user.email}`);
      return response.data.data.role;
    },
    enabled: !!user?.email, // Only run query if user email exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2
  });

  return {
    userRole,
    isLoading,
    error,
    refetch,
    isAdmin: userRole === 'admin',
    isModerator: userRole === 'moderator',
    isUser: userRole === 'user'
  };
};

export default useUserRole;