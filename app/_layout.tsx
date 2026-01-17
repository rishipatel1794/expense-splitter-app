import { Stack } from 'expo-router';
import { GroupProvider } from '../context/GroupContext';
import { Colors } from '../constants/colors';

export default function Layout() {
  return (
    <GroupProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#ffffff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Expense Splitter 💸' }}
        />
        <Stack.Screen
          name="create-group"
          options={{ title: 'New Group' }}
        />
        <Stack.Screen
          name="group"
          options={{ title: 'Group Expenses' }}
        />
      </Stack>
    </GroupProvider>
  );
}
