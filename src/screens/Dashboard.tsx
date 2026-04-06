import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ENTRIES } from '../api/queries';
import { COLORS } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Flame, Calendar, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_ENTRIES, {
    pollInterval: 5000,
  });

  const entries = data?.getEntries || [];

  const dailyCalories = entries
    .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + e.calories, 0);

  const weeklyCalories = entries
    .filter(e => {
        const d = new Date(e.date);
        const now = new Date();
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= 7;
    })
    .reduce((sum, e) => sum + e.calories, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Daily Intake</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>

        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Today's Calories</Text>
            <Text style={styles.summaryValue}>{dailyCalories}</Text>
            <Text style={styles.summarySub}>Target: 2,500 kcal</Text>
          </View>
          <Flame color="#fff" size={48} opacity={0.3} style={styles.summaryIcon} />
        </LinearGradient>

        <View style={styles.statsRow}>
            <View style={styles.miniCard}>
                <Calendar color={COLORS.primary} size={20} />
                <Text style={styles.miniLabel}>Weekly</Text>
                <Text style={styles.miniValue}>{weeklyCalories}</Text>
            </View>
            <View style={styles.miniCard}>
                <Info color={COLORS.accent} size={20} />
                <Text style={styles.miniLabel}>Entries</Text>
                <Text style={styles.miniValue}>{entries.length}</Text>
            </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
        </View>

        {loading ? (
            <Text style={styles.statusText}>Loading...</Text>
        ) : error ? (
            <Text style={styles.statusText}>Error connecting to server</Text>
        ) : entries.length === 0 ? (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No meals logged today</Text>
            </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.mealCard}>
              <View>
                <Text style={styles.foodName}>{entry.foodName}</Text>
                <Text style={styles.mealTime}>{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <Text style={styles.calories}>{entry.calories} kcal</Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Plus color="#fff" size={32} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  date: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '800',
    marginVertical: 4,
  },
  summarySub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  summaryIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  miniCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    width: width * 0.43,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  miniLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  miniValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  mealCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  mealTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  calories: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statusText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});

export default Dashboard;
