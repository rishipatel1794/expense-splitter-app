import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '../context/GroupContext';
import { Colors } from '../constants/colors';

const calculateSplit = (group:any) => {
    const total = group.expenses.reduce((sum:number, e:any) => sum + e.amount, 0);
    const perPerson = total / group.members.length;

    return {
        total,
        perPerson,
    };
};
export default function GroupScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { groups } = useGroups();
    
    const group = groups.find(g => g.id === id);
    const { total, perPerson } = group ? calculateSplit(group) : { total: 0, perPerson: 0 };


    if (!group) {
        return <Text>Group not found</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Expenses</Text>

            {group.expenses.length === 0 ? (
                <Text style={styles.empty}>No expenses yet</Text>
            ) : (
                <FlatList
                    data={group.expenses}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryText}>Total Spent</Text>
                            <Text style={styles.summaryAmount}>₹{total}</Text>

                            <Text style={styles.summarySub}>
                                Each person should pay ₹{perPerson.toFixed(2)}
                            </Text>
                        </View>

                    )}
                />
            )}

            <Pressable
                style={styles.fab}
                onPress={() => router.push(`/add-expense?groupId=${group.id}`)}
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
        marginBottom: 20,
        color: Colors.textDark,
    },
    empty: {
        textAlign: 'center',
        color: Colors.textLight,
        marginTop: 50,
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
        color: Colors.textDark,
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
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
    summaryCard: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
    },
    summaryText: {
        color: Colors.textLight,
    },
    summaryAmount: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textDark,
    },
    summarySub: {
        marginTop: 6,
        color: Colors.secondary,
    },

});
