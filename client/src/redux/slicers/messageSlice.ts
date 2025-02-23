import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "../services/messageService";
import { objectId, message } from "../../type";
type obj = message & objectId;
interface chatState {
  message: obj | null;
  messages: obj[];
  onlineUsers: string[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: chatState = {
  message: null,
  onlineUsers: [],
  messages: [],
  loading: false,
  error: null as string | null,
  success: false,
};

export const getPrivateMessages = createAsyncThunk(
  "getPrivateMessages",
  async (username: string, api) => {
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
      return await messageService.getPrivateMessages(username, config);
    } catch (error) {
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);

export const getGroupsMessages = createAsyncThunk(
  "getGroupsMessages",
  async (groupName: string, api) => {
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
      return await messageService.getGroupMessages(groupName, config);
    } catch (error) {
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: { payload: obj }) => {
      state.messages.push(action.payload);
    },
    setOnlineUsers: (state, action: { payload: string[] }) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrivateMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPrivateMessages.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(getPrivateMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload as obj[];
        state.success = true;
        state.error = null;
      })
      .addCase(getGroupsMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupsMessages.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(getGroupsMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload as obj[];
        state.success = true;
        state.error = null;
      });
  },
});
export const { addMessage, setOnlineUsers } = messageSlice.actions;

export default messageSlice.reducer;
