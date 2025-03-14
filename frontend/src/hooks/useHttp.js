import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
    const response = await fetch(url, config);

    const resData = await response.json();

    if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong, failed to send request');//built in Error constructor provided by the browser.
    }

    return resData;
}
//Yes, a re-render of a custom hook in React can result in the re-render of the component that uses that custom hook, but it depends on how the hook is implemented and what state or effects it manages.
export default function useHttp(url, config, initialData) {

    const [error, setError] = useState();
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);

    function clearData(){
        setData(initialData);
    }

    const sendRequest = useCallback(
        async function sendRequest(data) {
            setIsLoading(true);
            try {
                const resData = await sendHttpRequest(url, { ...config, body: data }); {/*Yes, that's correct! When you send a fetch request inside an async function, it initially returns a Promise. However, since you're using async/await, JavaScript will automatically wait for the Promise to resolve and return the resolved data, making the asynchronous code look more synchronous. Resolve the Promise from response.json().*/ }
                setData(resData);
                return (resData);
            } catch (error) {
                setError(error.message || 'Something went wrong');
            }
            finally {
                setIsLoading(false);
            }
        }, [url, config]);

    useEffect(() => {
        if ((config && (config.method === 'GET' || !config.method)) || !config) {
            sendRequest();
        }
    }, [sendRequest, config]);

    return {
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    };
}