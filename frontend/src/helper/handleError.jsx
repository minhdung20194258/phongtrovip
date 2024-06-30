import store from '@/reducers';

export function handleErrorApi(error) {
  const code = !error?.response ? error?.code : error?.response?.data?.error?.code;
  const message = !error?.response ? error?.message : error?.response?.data?.error?.message;

  store.dispatch({
    type: 'dialog/open',
    payload: {
      type: 'error',
      header: 'Error',
      content: (
        <>
          {code && (
            <p>
              <span className="h-txt-16">Code: </span> {code}
            </p>
          )}
          <p>
            {code && <span className="h-txt-16">Message: </span>}
            {message}
          </p>
        </>
      ),
    },
  });
}
