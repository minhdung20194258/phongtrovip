import axios from 'axios';

const clientApi = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || ''}/api/v1`,
  timeout: 60000,
});

clientApi.interceptors.response.use(
  (resp) => {
    console.log(resp.data);
    return resp.data;
  },
  async (error) => {
    console.log(error);
    // if (error?.resp?.data?.error?.code === 'EXPRIRED_TOKEN' && error?.resp?.status === 403) {
    //   // await store.dispatch(ACTION_UPDATE_ACCESS_TOKEN);
    //   return clientApi.request(error.config);
    // }
    throw error;
  },
);

export const updateAxiosAccessToken = (accessToken) => {
  clientApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  return clientApi;
};

export const removeAxiosAccessToken = () => {
  delete clientApi.defaults.headers.common['Authorization'];
};

(() => {
  const userJson = localStorage.getItem('userData');
  if (userJson) {
    const {accessToken} = JSON.parse(userJson);
    updateAxiosAccessToken(accessToken);
  }
})();

// (() => {
//   const accessToken = localStorage.getItem(PreferenceKeys.accessToken);
//   if (isTokenValid) {
//     const token = localStorage.getItem(PreferenceKeys.accessToken);
//     updateAxiosAccessToken(token);
//   } else {
//     UserHelper.authSignOut();
//   }
// })();

export default clientApi;
