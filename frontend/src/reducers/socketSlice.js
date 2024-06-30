import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  onlineUsers: [],
  chatLists: [],
  sendMessage: () => {},
  newMessage: {},
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSendMessage: (state, {payload}) => ({...state, sendMessage: payload}),
    setOnlineUsers: (state, {payload}) => ({...state, onlineUsers: payload}),
    setChatLists: (state, {payload}) => ({...state, chatLists: payload}),
    setNewMessage: (state, {payload}) => ({...state, newMessage: payload}),
  },
});
export const {setSendMessage, setOnlineUsers, setChatLists, setNewMessage} = socketSlice.actions;
export const getSendMessage = (state) => state.socket?.sendMessage;
export const getOnlineUsers = (state) => state.socket?.onlineUsers;
export const getChatLists = (state) => state.socket?.chatLists;
export const getNewMessage = (state) => state.socket?.newMessage;
export default socketSlice.reducer;
