import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Configura comportamento das notificações em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicita permissão
export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Agenda notificação local
export async function scheduleTaskNotification(task) {
  if (!task.dueDate) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Tarefa: ${task.title}`,
      body: task.description || 'Lembre-se da sua tarefa!',
    },
    trigger: task.dueDate, // Date object
  });
}