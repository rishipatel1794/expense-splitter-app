import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useGroups } from '../context/GroupContext';
import { Colors } from '../constants/colors';
import { LayoutAnimation } from 'react-native';


export default function AddExpenseScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const { addExpense } = useGroups();

  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleAdd = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    addExpense(groupId!, {
      id: Date.now().toString(), // unique ID
      title: title.trim(),
      amount: Number(amount),
      paidBy: 'You',
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Expense</Text>

      <TextInput
        placeholder="Expense title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: Colors.textDark,
  },
  input: {
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
