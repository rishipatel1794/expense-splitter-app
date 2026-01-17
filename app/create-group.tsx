import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useGroups } from '../context/GroupContext';
import { Colors } from '@/constants/theme';
import { Colors as ColorsConst } from '../constants/colors';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState('');

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert('Group name required');
      return;
    }
    addGroup(groupName.trim());
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Group</Text>

      <TextInput
        placeholder="Group name (Trip, Roommates...)"
        value={groupName}
        onChangeText={setGroupName}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Group</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: ColorsConst.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: ColorsConst.background,
  },
  button: {
    backgroundColor: ColorsConst.primary,
    padding: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
