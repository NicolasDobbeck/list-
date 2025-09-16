import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { List, FAB, Portal, Dialog, Button, TextInput, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../config/firebase';
import { onTasksRealtime, addTask, updateTask, deleteTask } from '../services/firestore';
import { logout } from '../services/auth';
import { useMotivationalQuote } from '../hooks/useMotivationalQuote';
import ThemeContext from '../context/ThemeContext';
import I18nContext from '../context/I18nContext';
import { scheduleTaskNotification } from '../services/notifications';

export default function TasksScreen() {
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

  const user = auth.currentUser;
  
  const { data: quote, isLoading: isQuoteLoading, isError: isQuoteError } = useMotivationalQuote();

  useEffect(() => {
    if (user) {
      const unsubscribe = onTasksRealtime(user.uid, (data) => {
        setTasks(data);
      });
      return unsubscribe;
    }
  }, [user]);

  const handleAddTask = async () => {
    if (!taskTitle) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório.');
      return;
    }
    const taskData = {
      title: taskTitle,
      description: taskDescription,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: dueDate,
    };
    try {
      if (editingTask) {
        await updateTask(user.uid, editingTask.id, taskData);
      } else {
        await addTask(user.uid, taskData);
      }
      if (dueDate) {
        await scheduleTaskNotification(taskData);
      }
      setIsDialogVisible(false);
      setTaskTitle('');
      setTaskDescription('');
      setDueDate(new Date());
      setEditingTask(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
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
          <Button onPress={() => handleEditTask(item)} mode="text">
            Editar
          </Button>
          <Button onPress={() => handleDeleteTask(item.id)} mode="text" color="red">
            Excluir
          </Button>
        </View>
      )}
      onPress={() => handleCompleteTask(item)}
      style={styles.listItem(item.completed)}
    />
  );
  
  const handleToggleLang = () => {
    const newLocale = locale === 'pt' ? 'en' : 'pt';
    setAppLocale(newLocale);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {isQuoteLoading && <ActivityIndicator style={styles.quoteLoading} animating={true} color={paperTheme.colors.primary} />}
      {!isQuoteLoading && !isQuoteError && quote && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteAuthor}>- {quote.author || 'Anônimo'}</Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        style={styles.list}
      />

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
            <Button onPress={() => setShowDatePicker(true)}>
              {`Data de Vencimento: ${dueDate.toLocaleString()}`}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="datetime"
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  quoteContainer: {
    padding: 15,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
  },
  quoteText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 5,
  },
  quoteAuthor: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listItem: (completed) => ({
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    textDecorationLine: completed ? 'line-through' : 'none',
  }),
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogInput: {
    marginBottom: 10,
  },
});