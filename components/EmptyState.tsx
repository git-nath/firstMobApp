import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CircleCheck as CheckCircle, ListTodo } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { TaskFilter } from '@/types/task';

interface EmptyStateProps {
  activeFilter: TaskFilter;
}

export default function EmptyState({ activeFilter }: EmptyStateProps) {
  const { colors } = useTheme();
  
  let icon;
  let title;
  let message;
  
  switch (activeFilter) {
    case 'completed':
      icon = <CheckCircle color={colors.subtext} size={48} />;
      title = 'No completed tasks';
      message = 'Tasks you complete will appear here.';
      break;
    case 'active':
      icon = <ListTodo color={colors.subtext} size={48} />;
      title = 'No active tasks';
      message = 'You\'ve completed all your tasks! Add more to stay productive.';
      break;
    case 'all':
    default:
      icon = <ListTodo color={colors.subtext} size={48} />;
      title = 'No tasks yet';
      message = 'Add a task to get started.';
      break;
  }
  
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.border + '40' }]}>
        {icon}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.subtext }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
});