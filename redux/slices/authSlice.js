import { createSlice } from "@reduxjs/toolkit";

import _ from "lodash";

const emptyState = () => ({
  me: { name: "", email: "", token: "" },
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...emptyState(),
  },
  reducers: {
    initMe: (state, action) => {
      const { name = "", email, token } = action.payload;
      Object.assign(state.me, { name, email, token });
    },
    dropMe: () => {
      return emptyState();
    },
  },
});

export const selectMe = (state) => state.auth.me;
export const selectToken = (state) => state.auth.me.token;

export const { dropMe, setAuth } = authSlice.actions;

export { emptyState as authEmptyState };

export default authSlice.reducer;
