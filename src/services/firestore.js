import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

// Retorna a referência da coleção de tarefas do usuário
export const getUserTasksCollection = (userId) => {
  return collection(db, 'users', userId, 'tasks');
};

// Funções para CRUD
export const addTask = (userId, taskData) => {
  const userTasksCollection = getUserTasksCollection(userId);
  return addDoc(userTasksCollection, taskData);
};

export const updateTask = (userId, taskId, taskData) => {
  const taskDocRef = doc(db, 'users', userId, 'tasks', taskId);
  return updateDoc(taskDocRef, taskData);
};

export const deleteTask = (userId, taskId) => {
  const taskDocRef = doc(db, 'users', userId, 'tasks', taskId);
  return deleteDoc(taskDocRef);
};

// Sincronização em tempo real (onSnapshot)
export const onTasksRealtime = (userId, onDataUpdate) => {
  const q = getUserTasksCollection(userId);
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tasks = [];
    querySnapshot.forEach((doc) => {
      // Adiciona o createdAt e updatedAt do Firebase
      tasks.push({ 
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      });
    });
    onDataUpdate(tasks);
  });
  return unsubscribe;
};