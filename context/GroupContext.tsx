import { createContext, useContext, useState, ReactNode } from 'react';

export type Member = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
};

export type Group = {
  id: string;
  name: string;
  expenses: Expense[];
};


type GroupContextType = {
  groups: Group[];
  addGroup: (name: string) => void;
  addExpense: (groupId: string, expense: Expense) => void;
};

const GroupContext = createContext<GroupContextType | null>(null);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);

  const addGroup = (name: string) => {
    setGroups(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        expenses: [],
        members: [
          { id: '1', name: 'You' },
          { id: '2', name: 'Friend' },
        ],
      },
    ]);
  };


  const addExpense = (groupId: string, expense: Expense) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, expenses: [...group.expenses, expense] }
          : group
      )
    );
  };

  return (
    <GroupContext.Provider value={{ groups, addGroup, addExpense }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroups must be used inside GroupProvider');
  return context;
}
