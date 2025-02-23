/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupService from "../services/groupService";

interface chatState {
  group: any | null;
  groups: any[] | [];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: chatState = {
  group: null,
  groups: [],
  loading: false,
  error: null as string | null,
  success: false,
};

export const getGroups = createAsyncThunk("getGroups", async (_, api) => {
  try {
    const appData = api.getState() as {
      userSlice: { user: { token: string } };
    };
    const { user } = appData.userSlice;
    // console.log(user);

    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: user.token,
      },
    };
    return await groupService.getGroups(config);
  } catch (error) {
    return api.rejectWithValue(
      (error as { response: { data: { message: string } } })?.response?.data
        ?.message
    );
  }
});

export const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload as any[];
        state.success = true;
        state.error = null;
      });
  },
});
export default groupSlice.reducer;
