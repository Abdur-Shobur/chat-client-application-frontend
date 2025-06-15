interface ValidationError {
	status: number | 'error';
	data: {
		remark: string;
		message: {
			error: string[] | string;
		};
	};
}

// Type guard to check if error is a ValidationError
export function isValidationError(error: unknown): error is ValidationError {
	if (typeof error !== 'object' || error === null) {
		return false; // Early exit if not an object
	}

	const validationError = error as ValidationError;

	return (
		('status' in validationError &&
			(validationError.status === 422 || validationError.status === 'error')) ||
		validationError.data?.remark === 'password_not_match' ||
		validationError.data?.remark === 'validation_error' ||
		validationError.data?.remark === 'stage_data' ||
		validationError.data?.remark === 'content_error'
	);
}
