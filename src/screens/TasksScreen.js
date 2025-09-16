import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import {
  List,
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
  Text,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

import { auth } from '../config/firebase';
import { onTasksRealtime, addTask, updateTask, deleteTask } from '../services/firestore';
import { logout } from '../services/auth';
import { useMotivationalQuote } from '../hooks/useMotivationalQuote';
import { ThemeContext } from '../context/ThemeContext';
import I18nContext from '../context/I18nContext';

// Agenda notificação usando o formato correto
async function scheduleTaskNotification(task) {
  if (!task.dueDate) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tarefa Pendente',
      body: task.title,
      sound: true,
      data: { taskId: task.id },
    },
    trigger: { type: 'date', date: task.dueDate },
  });
}

export default function TasksScreen({ navigation }) {
  const paperTheme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  const { i18n, locale, setAppLocale } = useContext(I18nContext);

  const [tasks, setTasks] = useState([]);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const user = auth.currentUser;
  const { data: quote, isLoading: isQuoteLoading, isError: isQuoteError } =
    useMotivationalQuote();

  useEffect(() => {
    if (user) {
      const unsubscribe = onTasksRealtime(user.uid, (data) => setTasks(data));
      return unsubscribe;
    }
  }, [user]);

  // ------------------- ADD TASK -------------------
  const handleAddTask = async () => {
    if (!taskTitle) return;

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate,
    };

    try {
      if (editingTask) await updateTask(user.uid, editingTask.id, taskData);
      else await addTask(user.uid, taskData);

      if (dueDate) await scheduleTaskNotification(taskData);
    } catch (error) {
      console.log('Erro ao adicionar tarefa:', error);
    } finally {
      setIsDialogVisible(false);
      setTaskTitle('');
      setTaskDescription('');
      setDueDate(new Date());
      setEditingTask(null);
      setShowDatePicker(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setDueDate(task.dueDate ? task.dueDate.toDate() : new Date());
    setIsDialogVisible(true);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(user.uid, taskId);
  };

  const handleCompleteTask = async (task) => {
    await updateTask(user.uid, task.id, { completed: !task.completed });
  };

  const renderTask = ({ item }) => (
    <List.Item
      title={item.title}
      description={item.description}
      left={(props) => (
        <List.Icon {...props} icon={item.completed ? 'check-circle' : 'circle-outline'} />
      )}
      right={() => (
        <View style={styles.listItemRight}>
          <Button onPress={() => handleEditTask(item)} mode="text">Editar</Button>
          <Button onPress={() => handleDeleteTask(item.id)} mode="text" textColor="red">Excluir</Button>
        </View>
      )}
      onPress={() => handleCompleteTask(item)}
      style={styles.listItem(item.completed)}
    />
  );

  const handleToggleLang = () => {
    setAppLocale(locale === 'pt' ? 'en' : 'pt');
  };

  const onDateChange = (event, selectedDate) => {
    if (!selectedDate) return;
    setShowDatePicker(false);

    const current = selectedDate || dueDate;

    if (pickerMode === 'date') {
      // Se for Android, depois abre o time picker
      setDueDate(new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        dueDate.getHours(),
        dueDate.getMinutes()
      ));
      if (Platform.OS === 'android') {
        setPickerMode('time');
        setShowDatePicker(true);
      }
    } else if (pickerMode === 'time') {
      setDueDate(new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
        current.getHours(),
        current.getMinutes()
      ));
      setPickerMode('date');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      {isQuoteLoading && (
        <ActivityIndicator style={styles.quoteLoading} animating color={paperTheme.colors.primary} />
      )}
      {!isQuoteLoading && !isQuoteError && quote && (
        <View style={[styles.quoteContainer, { backgroundColor: paperTheme.colors.surface }]}>
          <Text style={[styles.quoteText, { color: paperTheme.colors.onBackground }]}>
            "{quote.text}"
          </Text>
          <Text style={[styles.quoteAuthor, { color: paperTheme.colors.onBackground }]}>
            - {quote.author || 'Anônimo'}
          </Text>
        </View>
      )}

      <FlatList data={tasks} keyExtractor={(item) => item.id} renderItem={renderTask} style={styles.list} />

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>{i18n.t('add_task_form_title')}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={i18n.t('task_placeholder')}
              value={taskTitle}
              onChangeText={setTaskTitle}
              style={styles.dialogInput}
            />
            <TextInput
              label={i18n.t('task_description')}
              value={taskDescription}
              onChangeText={setTaskDescription}
              style={styles.dialogInput}
            />
            <Button onPress={() => { setPickerMode('date'); setShowDatePicker(true); }}>
              {`Data de Vencimento: ${dueDate.toLocaleString()}`}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode={pickerMode}
                is24Hour
                display="default"
                onChange={onDateChange}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleAddTask}>{editingTask ? 'Salvar' : 'Adicionar'}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB.Group
        open={isFabOpen}
        icon={isFabOpen ? 'close' : 'plus'}
        actions={[
          { icon: 'plus', label: i18n.t('tasks_add'), onPress: () => setIsDialogVisible(true) },
          { icon: 'theme-light-dark', label: i18n.t('toggle_theme'), onPress: toggleTheme },
          { icon: 'translate', label: i18n.t('toggle_lang'), onPress: handleToggleLang },
          { icon: 'logout', label: i18n.t('logout_button'), onPress: logout },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  quoteContainer: { padding: 15, marginBottom: 10, borderRadius: 8, marginHorizontal: 10, marginTop: 10 },
  quoteText: { fontStyle: 'italic', textAlign: 'center', marginBottom: 5 },
  quoteAuthor: { textAlign: 'right', fontWeight: 'bold' },
  list: { flex: 1 },
  listItem: (completed) => ({ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', textDecorationLine: completed ? 'line-through' : 'none' }),
  listItemRight: { flexDirection: 'row', alignItems: 'center' },
  dialogInput: { marginBottom: 10 },
});