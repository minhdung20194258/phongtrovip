import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
  type: '',
  content: '',
  header: '',
  onClose: () => {},
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    open: (state, {payload = {}}) => ({
      isShow: true,
      type: payload.type || 'success',
      content: payload.content,
      header: payload.header,
      onClose: payload.onClose,
    }),
    hidden: () => initialState,
  },
});
export const {hidden, open} = toastSlice.actions;

export const setToast = createAsyncThunk(
  'toast/open',
  /**
   * @param isShow
   * @param type
   * @param content
   * @param header
   * @param onClose
   * @param thunkApi
   * @return {Promise<void>}
   */
  async ({isShow, type, content, header, onClose}, thunkApi) => {
    thunkApi.dispatch(toastSlice.actions.open({isShow, type, content, header, onClose}));
    setTimeout(() => {
      thunkApi.dispatch(toastSlice.actions.hidden());
    }, 3000);
  },
);

export default toastSlice.reducer;
