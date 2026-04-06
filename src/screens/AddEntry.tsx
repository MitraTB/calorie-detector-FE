import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, FlatList, ScrollView } from 'react-native';
import { useMutation } from '@apollo/client';
import { ADD_ENTRY, GET_ENTRIES } from '../api/queries';
import { COLORS } from '../theme/colors';
import { ChevronLeft, Search, Sparkles, Utensils } from 'lucide-react-native';

const COMMON_DISHES = [
  { name: 'Pepperoni Pizza', calories: 285 },
  { name: 'Cheeseburger', calories: 550 },
  { name: 'Caesar Salad', calories: 150 },
  { name: 'Chicken Pasta', calories: 400 },
  { name: 'Grilled Chicken', calories: 240 },
  { name: 'Apple', calories: 95 },
  { name: 'Sushi Roll', calories: 300 },
  { name: 'Oatmeal', calories: 150 },
];

const AddEntry = ({ navigation }) => {
  const [foodName, setFoodName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [estimatedCalories, setEstimatedCalories] = useState(null);

  const [addEntry, { loading }] = useMutation(ADD_ENTRY, {
    refetchQueries: [{ query: GET_ENTRIES }],
    onCompleted: () => {
      navigation.goBack();
    },
    onError: (error) => {
        Alert.alert('Error', error.message);
    }
  });

  const handleSelectDish = (dish) => {
    setFoodName(dish.name);
    setEstimatedCalories(dish.calories);
  };

  const handleAnalyze = () => {
    if (!foodName) return;
    setAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      const found = COMMON_DISHES.find(d => d.name.toLowerCase().includes(foodName.toLowerCase()));
      const kcal = found ? found.calories : Math.floor(Math.random() * (400 - 100 + 1) + 100);
      setEstimatedCalories(kcal);
      setAnalyzing(false);
    }, 1200);
  };

  const handleSave = () => {
    if (!foodName || !estimatedCalories) return;
    addEntry({
      variables: {
        foodName,
        calories: estimatedCalories,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Food</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>What did you eat?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter food name..."
              placeholderTextColor={COLORS.textSecondary}
              value={foodName}
              onChangeText={(text) => {
                  setFoodName(text);
                  setEstimatedCalories(null);
              }}
            />
            <Search color={COLORS.textSecondary} size={20} style={styles.searchIcon} />
          </View>
        </View>

        {!estimatedCalories ? (
          <View>
            <TouchableOpacity
              style={[styles.button, !foodName && styles.disabledButton]}
              onPress={handleAnalyze}
              disabled={!foodName || analyzing}
            >
              {analyzing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonInner}>
                  <Sparkles color="#fff" size={20} />
                  <Text style={styles.buttonText}>Get Calories</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.suggestionSection}>
                <Text style={styles.suggestionTitle}>Common Dishes</Text>
                <View style={styles.dishGrid}>
                    {COMMON_DISHES.map((dish, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.dishTag}
                            onPress={() => handleSelectDish(dish)}
                        >
                            <Utensils size={14} color={COLORS.primary} style={{marginRight: 6}} />
                            <Text style={styles.dishTagText}>{dish.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <View style={styles.calorieBox}>
              <Text style={styles.resultLabel}>Estimated Calories</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultValue}>{estimatedCalories}</Text>
                <Text style={styles.resultUnit}>kcal</Text>
              </View>
              <Text style={styles.foodConfirmation}>{foodName}</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log this meal</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => setEstimatedCalories(null)}
            >
                <Text style={styles.retryText}>Edit Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    height: 56,
    color: COLORS.text,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  suggestionSection: {
      marginTop: 8,
  },
  suggestionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.text,
      marginBottom: 16,
  },
  dishGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
  },
  dishTag: {
      backgroundColor: COLORS.surface,
      borderColor: 'rgba(56, 189, 248, 0.2)',
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
  },
  dishTagText: {
      color: COLORS.text,
      fontSize: 14,
      fontWeight: '500',
  },
  resultContainer: {
    alignItems: 'stretch',
  },
  calorieBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  resultLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  resultValue: {
    color: COLORS.primary,
    fontSize: 64,
    fontWeight: '800',
  },
  resultUnit: {
    color: COLORS.textSecondary,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 4,
  },
  foodConfirmation: {
      color: COLORS.text,
      fontSize: 18,
      fontWeight: '600',
      marginTop: 8,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  retryButton: {
      alignItems: 'center',
      padding: 12,
  },
  retryText: {
      color: COLORS.textSecondary,
      fontSize: 14,
      fontWeight: '600'
  }
});

export default AddEntry;
