import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../context/GroupContext';
import { Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { Colors } from '../constants/colors';


export default function HomeScreen() {
    const router = useRouter();
    const { groups } = useGroups();

    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Groups</Text>

            {groups.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No groups yet</Text>
                    <Text style={styles.emptySub}>
                        Create a group to start splitting expenses
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <Pressable style={styles.card} onPress={() => router.push(`/group?id=${item.id}`)}>
                            <Text style={styles.cardText}>{item.name}</Text>
                        </Pressable>
                    )}
                />
            )}

            <Animated.View style={{ transform: [{ scale: scaleAnim }], position: 'absolute', bottom: 24, right: 24 }}>
                <Pressable
                    style={styles.fab}
                    onPress={() => router.push('/create-group')}
                >
                    <Text style={styles.fabText}>＋</Text>
                </Pressable>
            </Animated.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.background,
        color: Colors.textDark,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20,
    },
    emptyBox: {
        marginTop: 80,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    emptySub: {
        fontSize: 14,
        color: Colors.textDark,
        textAlign: 'center',
    },
    card: {
        backgroundColor: Colors.card,
        padding: 18,
        borderRadius: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '500',
    },
    fab: {
        backgroundColor: Colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },

    fabText: {
        color: '#fff',
        fontSize: 28,
        lineHeight: 28,
    },
});
