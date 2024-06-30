import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import clientApi, {updateAxiosAccessToken, removeAxiosAccessToken} from '@/helper/clientApi';

export const thunkSignGoogle = createAsyncThunk(
  'auto/auth/sign-in/google',
  async (accessToken, {rejectWithValue}) => {
    try {
      console.log({accessToken});
      updateAxiosAccessToken(accessToken);
      return await clientApi.get('/users/private');
    } catch (e) {
      return rejectWithValue(e.response);
    }
  },
);

export const thunkSignIn = createAsyncThunk(
  'auth/sign-in/local',
  async (params = {}, {rejectWithValue}) => {
    try {
      const {email, password} = params;
      return await clientApi.post('/users/auth/sign-in/local', {email, password});
    } catch (e) {
      return rejectWithValue(e.response);
    }
  },
);

export const thunkAutoSignIn = createAsyncThunk(
  'auto/auth/sign-in/local',
  async (_, {rejectWithValue}) => {
    try {
      const userJson = localStorage.getItem('userData');
      if (!userJson) return {success: false, data: {}};

      const user = JSON.parse(userJson);
      updateAxiosAccessToken(user.accessToken);
      return await clientApi.get('/users/private');
    } catch (e) {
      return rejectWithValue(e.response);
    }
  },
);

const initialState = {
  _id: '',
  email: '',
  fullName: '',
  avatar: {
    assetId: null,
    url: null,
    publicId: null,
  },
  imageCover: {
    assetId: null,
    url: null,
    publicId: null,
  },
  role: '',
  phoneNumber: '',
  authType: '',
  isActive: false,
  address: '',
  createdAt: '',
  postLikes: [],
  postDislikes: [],
  postSaves: [],
  amountBalance: 0,

  accessToken: '',
  refreshToken: '',
  expiresIn: '',

  autoLogout: false,
  loading: false,
  loadingAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, {payload = {}}) => {
      return {...state, ...payload};
    },
    autoSignIn: () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
    },
    resetErrorBE: (state) => {
      return {...state, errorMess: ''};
    },
    authSignOut: () => {
      localStorage.removeItem('userData');
      removeAxiosAccessToken();
      return {...initialState, loading: false};
    },
    updateAuth: (state, {payload = {}}) => {
      return {...state, ...payload};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunkSignGoogle.pending, (state) => ({
      ...state,
      loadingAuth: true,
    }));
    builder.addCase(thunkSignGoogle.fulfilled, (state, {payload = {}}) => {
      if (!payload.success) return {loading: false, errorMess: payload.message};

      const newState = {
        ...initialState,
        ...payload.data,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        expiresIn: payload.expiresIn,
        loading: false,
        loadingAuth: false,
      };
      localStorage.setItem('userData', JSON.stringify(newState));
      updateAxiosAccessToken(newState.accessToken);
      return newState;
    });
    builder.addCase(thunkSignGoogle.rejected, () => {
      return {...initialState, loading: false, loadingAuth: false};
    });

    builder.addCase(thunkAutoSignIn.pending, (state) => ({...state, loading: true}));
    builder.addCase(thunkAutoSignIn.fulfilled, (state, {payload = {}}) => {
      if (!payload.success) return {loading: false, errorMess: payload.message};

      const newState = {
        ...initialState,
        ...payload.data,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        expiresIn: payload.expiresIn,
        loading: false,
      };
      localStorage.setItem('userData', JSON.stringify(newState));
      updateAxiosAccessToken(newState.accessToken);
      return newState;
    });
    builder.addCase(thunkAutoSignIn.rejected, () => {
      return {...initialState, loading: false};
    });

    builder.addCase(thunkSignIn.pending, (state) => ({
      ...state,
      loadingAuth: true,
    }));
    builder.addCase(thunkSignIn.fulfilled, (state, {payload = {}}) => {
      if (!payload.success) return {loading: false, errorMess: payload.message};

      const newState = {
        ...initialState,
        ...payload.data,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        expiresIn: payload.expiresIn,
        loading: false,
        loadingAuth: false,
      };
      localStorage.setItem('userData', JSON.stringify(newState));
      updateAxiosAccessToken(newState.accessToken);
      return newState;
    });
    builder.addCase(thunkSignIn.rejected, () => {
      return {...initialState, loading: false, loadingAuth: false};
    });
  },
});

/**
 * @param state
 * @return {boolean}
 */
export const getIsAuth = (state) => !!state?.auth?.accessToken;
/**
 * @param state
 * @return {boolean}
 */
export const getIsStaff = (state) => ['admin', 'staff'].includes(state?.auth?.role);
/**
 * @param state
 * @return {boolean}
 */
export const getIsAdmin = (state) => ['admin'].includes(state?.auth?.role);
/**
 * @param state
 * @return {Users}
 */
export const getUser = (state) => state.auth;
/**
 * @param state
 * @return {boolean}
 */
export const getLoadingInitUser = (state) => state.auth.loading;

/**
 * @param state
 * @return {boolean}
 */
export const getLoadingSignIn = (state) => state.auth.loadingAuth;

/**
 * @param state
 * @return {string}
 */
export const getUserId = (state) => {
  if (state.auth._id) return state.auth._id;

  const userData = localStorage.getItem('userData');
  if (!userData) {
    return '';
  }
  return JSON.parse(userData)._id;
};
/**
 * @param state
 * @return {string}
 */
export const getErrorBE = (state) => state?.auth?.errorMess;

export const {resetErrorBE, authSignOut, autoSignIn, updateAuth, setAuth} = authSlice.actions;
export const setUser = setAuth;
export default authSlice.reducer;
