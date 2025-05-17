import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { TaskFilter } from '@/types/task';

interface TaskFiltersProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function TaskFilters({ activeFilter, onFilterChange, counts }: TaskFiltersProps) {
  const { colors } = useTheme();
  
  const filters: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            activeFilter === filter.key && { 
              backgroundColor: colors.primary + '20',
              borderColor: colors.primary,
            }
          ]}
          onPress={() => onFilterChange(filter.key)}
        >
          <Text 
            style={[
              styles.filterText, 
              { color: activeFilter === filter.key ? colors.primary : colors.text }
            ]}
          >
            {filter.label}
          </Text>
          <View 
            style={[
              styles.countBadge, 
              { 
                backgroundColor: activeFilter === filter.key 
                  ? colors.primary 
                  : colors.border 
              }
            ]}
          >
            <Text style={[styles.countText, { color: 'white' }]}>
              {counts[filter.key]}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 4,
    margin: 16,
    borderWidth: 1,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
});