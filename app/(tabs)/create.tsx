import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { addTask } from '@/utils/taskUtils';
import { Task } from '@/types/task';
import { router } from 'expo-router';
import { TriangleAlert as AlertTriangle, Calendar as CalendarIcon, Check, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  SlideOutDown 
} from 'react-native-reanimated';

type PriorityOption = 'high' | 'medium' | 'low';

export default function CreateTaskScreen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<PriorityOption>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Please enter a task title');
      return;
    }
    
    const newTask = {
      title: title.trim(),
      dueDate,
      priority,
      completed: false,
    };
    
    await addTask(newTask);
    triggerHaptic();
    router.replace('/');
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const selectDate = (date: Date | null) => {
    setDueDate(date ? date.toISOString() : null);
    setShowDatePicker(false);
  };
  
  const priorityOptions: PriorityOption[] = ['high', 'medium', 'low'];
  
  const getPriorityColor = (option: PriorityOption) => {
    const colorMap = {
      high: colors.highPriority,
      medium: colors.mediumPriority,
      low: colors.lowPriority,
    };
    return colorMap[option];
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };
  
  const getFormattedDate = () => {
    if (!dueDate) return 'Add due date';
    
    const date = new Date(dueDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Simple date picker for web (we'd use DateTimePicker for native)
  const renderDatePicker = () => {
    if (!showDatePicker) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const customDate = dueDate ? new Date(dueDate) : new Date();
    
    const dateOptions = [
      { label: 'Today', value: today },
      { label: 'Tomorrow', value: tomorrow },
      { label: 'Next Week', value: nextWeek },
      { label: 'No Date', value: null },
    ];
    
    return (
      <Animated.View
        entering={SlideInDown.springify()}
        exiting={SlideOutDown.springify()}
        style={[
          styles.datePickerContainer,
          { 
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          }
        ]}
      >
        <View style={styles.datePickerHeader}>
          <Text style={[styles.datePickerTitle, { color: colors.text }]}>Choose Due Date</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDatePicker(false)}
          >
            <X size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.dateOptionsList}>
          {dateOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.dateOption,
                dueDate === (option.value?.toISOString() || null) && {
                  backgroundColor: colors.primary + '20',
                }
              ]}
              onPress={() => selectDate(option.value)}
            >
              <Text 
                style={[
                  styles.dateOptionText, 
                  { color: colors.text }
                ]}
              >
                {option.label}
              </Text>
              
              {dueDate === (option.value?.toISOString() || null) && (
                <Check size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
          
          {/* This would be replaced with a proper date picker on native */}
          <View style={styles.customDateContainer}>
            <Text style={[styles.dateOptionText, { color: colors.text }]}>
              Custom Date:
            </Text>
            <TextInput
              style={[
                styles.customDateInput,
                { 
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                }
              ]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.subtext}
              value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
              onChangeText={(text) => {
                try {
                  const date = new Date(text);
                  if (!isNaN(date.getTime())) {
                    setDueDate(date.toISOString());
                  }
                } catch (e) {
                  // Invalid date
                }
              }}
            />
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View 
          style={[
            styles.formContainer, 
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}
        >
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Task Title</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: colors.text,
                  borderColor: titleError ? colors.error : colors.border,
                  backgroundColor: colors.background,
                }
              ]}
              placeholder="What do you need to do?"
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (text.trim()) {
                  setTitleError(null);
                }
              }}
              autoFocus
            />
            
            {titleError && (
              <Animated.View 
                entering={FadeIn}
                exiting={FadeOut}
                style={styles.errorContainer}
              >
                <AlertTriangle size={14} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {titleError}
                </Text>
              </Animated.View>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
            <View style={styles.priorityOptions}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor: priority === option 
                        ? getPriorityColor(option) + '20'
                        : colors.background,
                      borderColor: priority === option
                        ? getPriorityColor(option)
                        : colors.border,
                    }
                  ]}
                  onPress={() => {
                    setPriority(option);
                    triggerHaptic();
                  }}
                >
                  <View 
                    style={[
                      styles.priorityDot, 
                      { backgroundColor: getPriorityColor(option) }
                    ]}
                  />
                  <Text 
                    style={[
                      styles.priorityText, 
                      { 
                        color: priority === option 
                          ? getPriorityColor(option) 
                          : colors.text 
                      }
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                }
              ]}
              onPress={handleShowDatePicker}
            >
              <CalendarIcon size={18} color={colors.subtext} />
              <Text style={[styles.dateButtonText, { color: colors.text }]}>
                {getFormattedDate()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: colors.background, borderColor: colors.border }
            ]}
            onPress={handleCancel}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              { backgroundColor: colors.primary }
            ]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Save Task</Text>
          </TouchableOpacity>
        </View>
        
        {renderDatePicker()}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  saveButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  dateOptionsList: {
    maxHeight: 300,
  },
  dateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateOptionText: {
    fontSize: 16,
  },
  customDateContainer: {
    marginTop: 8,
  },
  customDateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
  },
});