interface AggregatedData {
  [key: string]: {
    [key: string]: number[];
  };
}

type BudgetCardItem = {
  id: string;
  budgetedName: string;
  amount: number;
  allocated: number;
};

type BudgetCardProps = {
  items: BudgetCardItem[];
};

interface BudgetMainSlice {
  id: string;
  categoryId: number | null;
  groupId: number | null;
  amount: number;
  yearMonth: string;
}

export {
  BudgetCardProps,
  BudgetCardItem,
  AggregatedData,
  BudgetMainSlice,
}