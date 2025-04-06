class DataError extends Error {
	error: any;
	constructor(message: string, error: any) {
		super(message);
		this.error = error;
	}
}

const fetcher = async (...args: [RequestInfo, RequestInit?]) => {
	const res = await fetch(...args);
	const json = await res.json();
	if (res.status === 200) {
		return json;
	}

	const error = new DataError(
		`${res.status}: ${json.error.message}`,
		json.error,
	);
	throw error;
};

export default fetcher;
