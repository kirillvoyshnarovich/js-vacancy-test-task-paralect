import { showNotification } from '@mantine/notifications';

export default function notify(message: any, type: string = 'success') {
  if (type === 'success') {
    showNotification({
      title: 'Success',
      message,
      color: 'blue',
      withBorder: true,
    });
  } else if (type === 'info') {
    showNotification({
      title: 'Info',
      message,
      color: 'green',
      withBorder: true,
    });
  } else if (type === 'error') {
    showNotification({
      title: 'Error',
      message,
      color: 'red',
      withBorder: true,
    });
  }
}
