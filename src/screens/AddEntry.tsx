import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { ADD_ENTRY, GET_ENTRIES } from '../api/queries';
import { COLORS } from '../theme/colors';
import { ChevronLeft, Search, Sparkles } from 'lucide-react-native';

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

  const handleAnalyze = () => {
    if (!foodName) return;
    setAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      // Mock calorie lookup logic
      const mocks = {
        'pizza': 285,
        'apple': 95,
        'burger': 550,
        'salad': 150,
        'pasta': 400,
        'chicken': 240,
      };
      
      const found = mocks[foodName.toLowerCase()];
      const kcal = found || Math.floor(Math.random() * (400 - 100 + 1) + 100);
      setEstimatedCalories(kcal);
      setAnalyzing(false);
    }, 1500);
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
        <Text style={styles.title}>Track Meal</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>What did you eat?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Pepperoni Pizza"
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
                <Text style={styles.buttonText}>Analyze Calories</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.resultContainer}>
            <View style={styles.calorieBox}>
              <Text style={styles.resultLabel}>Estimated Calories</Text>
              <Text style={styles.resultValue}>{estimatedCalories} kcal</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log Meal</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => setEstimatedCalories(null)}
            >
                <Text style={styles.retryText}>Edit Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  content: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 32,
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
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  disabledButton: {
    opacity: 0.6,
  },
  resultContainer: {
    alignItems: 'stretch',
  },
  calorieBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  resultLabel: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  resultValue: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: '800',
    marginTop: 8,
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
