import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups, Expense } from '../context/GroupContext';
import { Colors } from '../constants/colors';
import { Alert } from 'react-native';
import { LayoutAnimation } from 'react-native';


export default function GroupScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { groups, removeExpense } = useGroups();


    const group = groups.find(g => g.id === id);

    if (!group) {
        return <Text>Group not found</Text>;
    }

    const total = group.expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Expenses</Text>

            <Text style={styles.total}>Total: ₹{total}</Text>

            <FlatList
                data={group.expenses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => { }}
                        onLongPress={() =>
                            Alert.alert(
                                'Delete Expense',
                                'Are you sure you want to delete this expense?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => {
                                            LayoutAnimation.configureNext(
                                                LayoutAnimation.Presets.easeInEaseOut
                                            );
                                            removeExpense(group.id, item.id);
                                        },
                                    },
                                ]
                            )
                        }
                    >
                        <View style={styles.card}>
                            <View>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.paidBy}>Paid by {item.paidBy}</Text>
                            </View>
                            <Text style={styles.amount}>₹{item.amount}</Text>
                        </View>
                    </Pressable>
                )}
            />


            <Pressable
                style={styles.fab}
                onPress={() => {
                    router.push(`/add-expense?groupId=${group.id}`);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }}
            >
                <Text style={styles.fabText}>＋</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.background,
    },
    heading: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    total: {
        fontSize: 16,
        marginBottom: 20,
        color: Colors.secondary,
    },
    card: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    paidBy: {
        fontSize: 12,
        color: Colors.textLight,
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: Colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        color: '#fff',
        fontSize: 28,
    },
});
