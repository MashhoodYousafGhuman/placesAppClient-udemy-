import { useState, useCallback } from "react"
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()

	const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
		setIsLoading(true)

		try {
			const response = await fetch(url, {
				method, body, headers
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message);
			}

			return responseData
		} catch (err) {
			console.log('err from sendRequest function in http-hook', err)
			setError(err.message)
		}

		setIsLoading(true)
	}, [])

	return { isLoading, error, sendRequest }
};
