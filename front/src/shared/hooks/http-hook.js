import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //a piece of data will not be reinitialized when this function runs again.
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      //AbortControllerのabortメソッドはfetchリクエストを停止させる(無駄なreqを節約する)
      const httpAbortCtrl = new AbortController();
      //useRef always wrap the data you store in an object which has a current property
      //   fetchメソッドを実行するたびにhttpAbortCtrlオブジェクトがregisterされる
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal, //signalプロパティにabortコントローラをlinkさせることでこのfetchメソッドをキャンセルできるようになる
        });
        const responseData = await response.json();

        //  we want to clear the abortController that belong to the request which just complete it .
        // filter out this specific controller that was responsible for this specific request.
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
        if (!response.ok) {
          //status code = 4xx or 5xx
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };
  useEffect(() => {
    return () => {
      // unMountされるたびにhttpAbortCtrlがクリーンナップされる
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
