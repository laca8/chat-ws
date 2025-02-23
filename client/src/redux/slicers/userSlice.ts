import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/userService";
import { objectId, user } from "../../type";
type obj = user & objectId;
const userStorage = JSON.parse(localStorage.getItem("user") || "null");
interface UserState {
  user: obj | null;
  users: obj[] | [null];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  user: userStorage ? userStorage : null,
  users: [],
  loading: false,
  error: null as string | null,
  success: false,
};
//create action
export const cretaeUser = createAsyncThunk(
  "cretaeUser",
  async (user: user, api) => {
    try {
      return await authService.createUser(user);
    } catch (error) {
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
export const loginUser = createAsyncThunk(
  "loginUser",
  async (user: user, api) => {
    try {
      return await authService.loginUser(user);
    } catch (error) {
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
export const fetchUsers = createAsyncThunk("fetchUsers", async (_, api) => {
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
    return await authService.fetchUsers(config);
  } catch (error) {
    return api.rejectWithValue(
      (error as { response: { data: { message: string } } })?.response?.data
        ?.message
    );
  }
});
export const logout = createAsyncThunk("logout", async () => {
  return await authService.logout();
});

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cretaeUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(cretaeUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(cretaeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as obj;
        state.success = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload } as obj;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload as obj[];
        state.success = true;
        state.error = null;
      });
  },
});
export default userSlice.reducer;
