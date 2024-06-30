import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
  type: '',
  header: '',
  content: '',
  onCancel: () => {},
  onAccept: () => {},
  primaryLabel: '',
  url: '',
  loading: false,
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    open: (state, {payload = {}}) => ({
      isShow: true,
      type: payload.type,
      header: payload.header,
      content: payload.content,
      onCancel: payload.onCancel,
      onAccept: payload.onAccept,
      primaryLabel: payload.primaryLabel,
      url: payload.url,
      loading: payload.loading,
    }),
    hidden: () => initialState,
  },
});

export const {open, hidden} = dialogSlice.actions;

/**
 * @param props {Dialog}
 */
export const setDialog = (props) => open(props);
export default dialogSlice.reducer;
