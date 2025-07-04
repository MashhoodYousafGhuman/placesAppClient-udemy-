import { useState, useCallback, useEffect, useRef } from "react"

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()

	const activeHttpRequests = useRef([])

	const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
		setIsLoading(true)

		const httpAbortCtrl = new AbortController();
		activeHttpRequests.current.push(httpAbortCtrl);

		try {
			const response = await fetch(url, {
				method, body, headers,
				signal: httpAbortCtrl.signal
			});

			const responseData = await response.json();

			activeHttpRequests.current = activeHttpRequests.current.filter(
				reqCtrl => reqCtrl !== httpAbortCtrl
			);
			// reqCtrl is httpAbortCtrl in activeHttpRequests.current array

			if (!response.ok) {
				throw new Error(responseData.message);
			}

			setIsLoading(false)
			return responseData
		} catch (err) {
			console.log('err from sendRequest function in http-hook =>', err)
			setError(err.message)
			setIsLoading(false)
			throw err
		}
	}, [])

	const clearError = () => {
		setError(null)
	};

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
		}
	}, [])

	return { isLoading, error, sendRequest, clearError }
};
