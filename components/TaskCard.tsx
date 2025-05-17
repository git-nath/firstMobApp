import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Check, Calendar, Trash2 } from 'lucide-react-native';
import { Task } from '@/types/task';
import { useTheme } from '@/context/ThemeContext';
import { formatDate } from '@/utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const { colors } = useTheme();
  const swipeableRef = React.useRef<Swipeable>(null);

  const priorityColor = {
    high: colors.highPriority,
    medium: colors.mediumPriority,
    low: colors.lowPriority
  }[task.priority];

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });
    
    return (
      <View style={styles.rightActionsContainer}>
        <Animated.View
          style={[
            styles.rightAction,
            { transform: [{ translateX: trans }], backgroundColor: colors.error }
          ]}
        >
          <RectButton 
            style={[styles.rightActionButton]} 
            onPress={() => {
              swipeableRef.current?.close();
              onDelete(task.id);
            }}
          >
            <Trash2 color="white" size={22} />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [-80, 0],
      extrapolate: 'clamp',
    });
    
    return (
      <View style={styles.leftActionsContainer}>
        <Animated.View
          style={[
            styles.leftAction,
            { transform: [{ translateX: trans }], backgroundColor: colors.success }
          ]}
        >
          <RectButton 
            style={[styles.leftActionButton]} 
            onPress={() => {
              swipeableRef.current?.close();
              onToggleComplete(task.id);
            }}
          >
            <Check color="white" size={22} />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={!task.completed ? renderLeftActions : undefined}
      renderRightActions={renderRightActions}
    >
      <View 
        style={[
          styles.taskCard, 
          { 
            backgroundColor: colors.card,
            borderLeftColor: priorityColor,
            opacity: task.completed ? 0.7 : 1,
          }
        ]}
      >
        <View style={styles.checkboxWrapper}>
          <RectButton
            style={[
              styles.checkbox,
              { 
                borderColor: task.completed ? colors.success : colors.border,
                backgroundColor: task.completed ? colors.success : 'transparent',
              }
            ]}
            onPress={() => onToggleComplete(task.id)}
          >
            {task.completed && <Check color="white" size={16} />}
          </RectButton>
        </View>
        
        <View style={styles.contentContainer}>
          <Text 
            style={[
              styles.title, 
              { 
                color: colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              }
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <Calendar color={colors.subtext} size={14} />
              <Text style={[styles.dueDate, { color: colors.subtext }]}>
                {formatDate(task.dueDate)}
              </Text>
            </View>
          )}
        </View>
        
        <View 
          style={[
            styles.priorityBadge, 
            { backgroundColor: priorityColor + '20' }
          ]}
        >
          <Text style={[styles.priorityText, { color: priorityColor }]}>
            {task.priority}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxWrapper: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rightActionsContainer: {
    width: 80,
    flexDirection: 'row',
    marginVertical: 4,
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  rightActionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  leftActionsContainer: {
    width: 80,
    flexDirection: 'row',
    marginVertical: 4,
  },
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  leftActionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});