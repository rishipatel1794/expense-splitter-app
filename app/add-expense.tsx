import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useGroups } from '../context/GroupContext';
import { Colors } from '../constants/colors';

export default function AddExpenseScreen() {
    const { groupId } = useLocalSearchParams<{ groupId: string }>();
    const router = useRouter();
    const { addExpense } = useGroups();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    const handleAdd = () => {
        if (!title || !amount) {
            Alert.alert('All fields required');
            return;
        }

        addExpense(groupId!, {
            id: Date.now().toString(),
            title,
            amount: Number(amount),
            paidBy: 'You',
        });


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
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});
