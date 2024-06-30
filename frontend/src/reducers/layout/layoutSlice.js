import {createSlice} from '@reduxjs/toolkit';
import {DEVICE_DESKTOP, DEVICE_MOBILE} from '@/const/layout.js';

const initialState = {
  device: DEVICE_DESKTOP,
  isHiddenNavbar: false,
  isHiddenSidebar: false,
  isShowMenu: false,
  isDesktop: true,
  isMobile: false,
  isShowModalSignIn: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setShowModalSignIn: (state, {payload}) => ({...state, isShowModalSignIn: payload}),
    showNavbar: (state) => ({...state, isHiddenNavbar: false}),
    hiddenNavbar: (state) => ({...state, isHiddenNavbar: true}),
    showSidebar: (state) => ({...state, isHiddenSidebar: false}),
    hiddenSidebar: (state) => ({...state, isHiddenSidebar: true}),
    setDevice: (state, {payload = DEVICE_DESKTOP}) => {
      if (state.device === payload) return;
      return {
        ...state,
        device: payload,
        isDesktop: payload === DEVICE_DESKTOP,
        isMobile: payload === DEVICE_MOBILE,
      };
    },
    setLayout: (state, {payload = {}}) => ({...state, ...payload}),
    setShowMenu: (state, {payload}) => ({...state, isShowMenu: payload}),
    toggleShowMenu: (state) => ({...state, isShowMenu: !state.isShowMenu}),
  },
});

export const {
  toggleShowMenu,
  setShowMenu,
  showNavbar,
  hiddenNavbar,
  showSidebar,
  hiddenSidebar,
  setDevice,
  setLayout,
  setShowModalSignIn,
} = layoutSlice.actions;

export const getIsShowMenu = (state) => state.layout?.isShowMenu;
export const getDevice = (state) => state.layout;
export const getIsShowModalSignIn = (state) => state.layout.isShowModalSignIn;

export default layoutSlice.reducer;
