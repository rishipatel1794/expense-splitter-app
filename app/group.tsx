import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '../context/GroupContext';
import { Colors } from '../constants/colors';

const calculateSplit = (group: any) => {
    const total = group.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const perPerson = total / group.members.length;

    return {
        total,
        perPerson,
    };
};

const calculateBalances = (group: any) => {
    const balances: Record<string, number> = {};

    // initialize balances
    group.members.forEach((m: any) => {
        balances[m.name] = 0;
    });

    const total = group.expenses.reduce(
        (sum: number, e: any) => sum + e.amount,
        0
    );

    const perPerson = total / group.members.length;

    // calculate paid amounts
    group.expenses.forEach((e: any) => {
        balances[e.paidBy] += e.amount;
    });

    // subtract share
    group.members.forEach((m: any) => {
        balances[m.name] -= perPerson;
    });

    return balances;
};

const getSettlementText = (balances: Record<string, number>) => {
    const entries = Object.entries(balances);
    if (entries.length < 2) return null;

    const [a, b] = entries;

    if (a[1] > 0) {
        return `${b[0]} owes ${a[0]} ₹${Math.abs(a[1]).toFixed(2)}`;
    } else {
        return `${a[0]} owes ${b[0]} ₹${Math.abs(b[1]).toFixed(2)}`;
    }
};


export default function GroupScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { groups } = useGroups();

    const group = groups.find(g => g.id === id);
    const { total, perPerson } = group ? calculateSplit(group) : { total: 0, perPerson: 0 };

    const balances = calculateBalances(group);
    const settlementText = getSettlementText(balances);


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
                            {settlementText && (
                                <View style={styles.settlementCard}>
                                    <Text style={styles.settlementTitle}>Settlement</Text>
                                    <Text style={styles.settlementText}>{settlementText}</Text>
                                </View>
                            )}
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
    settlementCard: {
        backgroundColor: '#ecfeff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
    },
    settlementTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    settlementText: {
        fontSize: 15,
        color: '#0369a1',
    },


});
