import { Task } from '@/types/task';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = 'tasks';

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasksString = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (tasksString) {
      return JSON.parse(tasksString);
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const addTask = async (newTask: Omit<Task, 'id' | 'createdAt'>): Promise<Task[]> => {
  const tasks = await loadTasks();
  
  const task: Task = {
    ...newTask,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  const updatedTasks = [...tasks, task];
  await saveTasks(updatedTasks);
  
  return updatedTasks;
};

export const updateTask = async (updatedTask: Task): Promise<Task[]> => {
  const tasks = await loadTasks();
  
  const updatedTasks = tasks.map(task => 
    task.id === updatedTask.id ? updatedTask : task
  );
  
  await saveTasks(updatedTasks);
  return updatedTasks;
};

export const deleteTask = async (taskId: string): Promise<Task[]> => {
  const tasks = await loadTasks();
  
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  
  await saveTasks(updatedTasks);
  return updatedTasks;
};

export const toggleTaskCompletion = async (taskId: string): Promise<Task[]> => {
  const tasks = await loadTasks();
  
  const updatedTasks = tasks.map(task => 
    task.id === taskId 
      ? { ...task, completed: !task.completed } 
      : task
  );
  
  await saveTasks(updatedTasks);
  return updatedTasks;
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  
  // If invalid date
  if (isNaN(date.getTime())) return 'Invalid date';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);
  
  if (taskDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  }
};