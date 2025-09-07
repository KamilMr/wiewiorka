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
  yearMonth: string;
};

type BudgetCardProps = {
  items: BudgetCardItem[];
  date: string;
};

interface BudgetMainSlice {
  id: string;
  categoryId: number | null;
  groupId: number | null;
  amount: number;
  yearMonth: string;
}

export {BudgetCardProps, BudgetCardItem, AggregatedData, BudgetMainSlice};
