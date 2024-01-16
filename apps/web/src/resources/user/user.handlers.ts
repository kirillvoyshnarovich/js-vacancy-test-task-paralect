import queryClient from 'query-client';
import { apiService, socketService } from 'services';
import router from 'next/router';
import { RoutePath } from 'routes';
import { User } from 'types';

apiService.on('error', (error: any) => {
  if (error.status === 401) {
    queryClient.setQueryData(['account'], null);
    router.push(RoutePath.NoAuthorization);
  }
});

socketService.on('connect', () => {
  const account = queryClient.getQueryData(['account']) as User;

  socketService.emit('subscribe', `user-${account._id}`);
});

socketService.on('user:updated', (data: User) => {
  queryClient.setQueryData(['account'], data);
});
