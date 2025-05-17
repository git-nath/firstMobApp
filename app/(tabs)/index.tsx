import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import EmptyState from '@/components/EmptyState';
import { Task, TaskFilter } from '@/types/task';
import { loadTasks, toggleTaskCompletion, deleteTask } from '@/utils/taskUtils';
import Animated, { 
  FadeInDown, 
  FadeOutUp, 
  Layout 
} from 'react-native-reanimated';

export default function TasksScreen() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const handleToggleComplete = async (id: string) => {
    const updatedTasks = await toggleTaskCompletion(id);
    setTasks(updatedTasks);
  };

  const handleDeleteTask = async (id: string) => {
    const updatedTasks = await deleteTask(id);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  // Sort tasks by completion status and due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // If both have due dates, sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Tasks with due dates come before tasks without due dates
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // If no due dates or same completion status, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TaskFilters 
        activeFilter={filter} 
        onFilterChange={setFilter} 
        counts={counts}
      />
      
      {sortedTasks.length === 0 ? (
        <EmptyState activeFilter={filter} />
      ) : (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Animated.View
              entering={FadeInDown.springify().mass(0.5)}
              exiting={FadeOutUp.springify().mass(0.5)}
              layout={Layout.springify().mass(0.5)}
            >
              <TaskCard
                task={item}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            </Animated.View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100, // Extra space at bottom for FAB
  },
});