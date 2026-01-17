import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups, Expense } from '../context/GroupContext';
import { Colors } from '../constants/colors';
import { Alert } from 'react-native';
import { LayoutAnimation } from 'react-native';

const calculateSplit = (group: any) => {
    const total = group.expenses.reduce(
        (sum: number, e: any) => sum + e.amount,
        0
    );

    if (group.expenses.length === 0) {
        return { total: 0, perPerson: 0 };
    }
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
    const { groups, removeExpense } = useGroups();


    const group = groups.find(g => g.id === id);

    if (!group) {
        return <Text>Group not found</Text>;
    }
    const { total, perPerson } = calculateSplit(group);
    const balances = calculateBalances(group);
    const settlementText = getSettlementText(balances);


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Expenses</Text>

            <Text style={styles.total}>Total: ₹{total}</Text>
            {group.expenses.length === 0 && (
                <Text style={styles.emptyHint}>
                    Add your first expense to start splitting 💡
                </Text>
            )}

            <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>Total Spent</Text>
                <Text style={styles.summaryAmount}>₹{total}</Text>

                <Text style={styles.summarySub}>
                    Each person should pay ₹{perPerson.toFixed(2)}
                </Text>
            </View>

            <Text style={styles.settlementText}>{settlementText}</Text>
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
            {total > 0 && settlementText && (
                <View style={styles.settlementCard}>
                    <Text style={styles.settlementEmoji}>💸</Text>
                    <Text style={styles.settlementTitle}>Settle Up</Text>
                    <Text style={styles.settlementText}>{settlementText}</Text>
                    <Text style={styles.settlementHint}>
                        You can settle this offline using any payment app
                    </Text>
                </View>
            )}


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
        backgroundColor: '#f0f9ff',
        padding: 18,
        borderRadius: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    settlementEmoji: {
        fontSize: 28,
        marginBottom: 6,
    },
    settlementTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    settlementText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#0369a1',
        marginBottom: 4,
    },
    settlementHint: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },

    emptyHint: {
        textAlign: 'center',
        color: Colors.textLight,
        marginBottom: 20,
    },


});
