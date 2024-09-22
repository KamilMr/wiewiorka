import { createSlice } from "@reduxjs/toolkit";

const emptyState = () => ({});

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    isLoading: false,
    ...emptyState(),
  },
  reducers: {},
});

export const {} = mainSlice.actions;

export { emptyState as mainEmptyState };

export default mainSlice.reducer;
