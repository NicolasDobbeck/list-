import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const scheduleTaskNotification = async (task) => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }

  const trigger = new Date(task.dueDate);
  if (trigger.getTime() > Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Tarefa",
        body: `Sua tarefa "${task.title}" está agendada para agora.`,
      },
      trigger,
    });
  }
};