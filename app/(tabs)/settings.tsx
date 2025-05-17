import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Switch, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { 
  Moon, 
  Sun, 
  Smartphone, 
  Trash2, 
  Info, 
  ChevronRight
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem('tasks');
      triggerHaptic();
      alert('All tasks have been cleared.');
    } catch (error) {
      console.error('Error clearing tasks:', error);
      alert('Failed to clear tasks. Please try again.');
    }
  };

  const renderThemeOption = (
    themeValue: 'light' | 'dark' | 'system',
    icon: JSX.Element,
    label: string
  ) => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        {
          backgroundColor: theme === themeValue ? colors.primary + '20' : 'transparent',
          borderColor: theme === themeValue ? colors.primary : 'transparent',
        }
      ]}
      onPress={() => {
        setTheme(themeValue);
        triggerHaptic();
      }}
    >
      {icon}
      <Text 
        style={[
          styles.themeOptionText, 
          { 
            color: theme === themeValue ? colors.primary : colors.text,
            fontWeight: theme === themeValue ? '600' : '400',
          }
        ]}
      >
        {label}
      </Text>
      
      {theme === themeValue && (
        <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <View style={styles.themeOptions}>
          {renderThemeOption(
            'light',
            <Sun size={20} color={theme === 'light' ? colors.primary : colors.text} />,
            'Light'
          )}
          
          {renderThemeOption(
            'dark',
            <Moon size={20} color={theme === 'dark' ? colors.primary : colors.text} />,
            'Dark'
          )}
          
          {renderThemeOption(
            'system',
            <Smartphone size={20} color={theme === 'system' ? colors.primary : colors.text} />,
            'System'
          )}
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
        
        <TouchableOpacity
          style={[styles.dangerButton, { borderColor: colors.error }]}
          onPress={clearAllTasks}
        >
          <Trash2 size={20} color={colors.error} />
          <Text style={[styles.dangerButtonText, { color: colors.error }]}>
            Clear All Tasks
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.disclaimer, { color: colors.subtext }]}>
          This action cannot be undone. All your tasks will be permanently removed.
        </Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        
        <View style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
          <Info size={18} color={colors.subtext} />
          <View style={styles.aboutContent}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>Version</Text>
            <Text style={[styles.aboutDetail, { color: colors.subtext }]}>1.0.0</Text>
          </View>
        </View>
        
        <View style={styles.aboutItem}>
          <Info size={18} color={colors.subtext} />
          <View style={styles.aboutContent}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>Made with</Text>
            <Text style={[styles.aboutDetail, { color: colors.subtext }]}>React Native & Expo</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    position: 'relative',
  },
  themeOptionText: {
    marginTop: 8,
    fontSize: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  aboutItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutContent: {
    marginLeft: 12,
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutDetail: {
    fontSize: 14,
    marginTop: 2,
  },
});