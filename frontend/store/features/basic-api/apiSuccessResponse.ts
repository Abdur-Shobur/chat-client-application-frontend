import { toast } from '@/hooks/use-toast';

interface ResponseSuccess {
	status: 'success';
	message: {
		success: string;
	};
}

interface ResponseError {
	status: 'error';
	message: {
		error: string;
	};
}

type ApiResponse = ResponseSuccess | ResponseError;

interface ResponseOptions {
	onSuccess?: () => void;
	onError?: () => void;
}

// Common response handler function
export async function handleResponse(
	response: ApiResponse,
	options?: ResponseOptions
) {
	// Show toast for success response
	if (response?.status === 'success' && response?.message?.success) {
		toast({ description: response?.message?.success, variant: 'default' });
		// Call the optional onSuccess callback
		if (options?.onSuccess) {
			options.onSuccess();
		}
	}

	// Show toast for error response
	else if (response?.status === 'error' && response?.message?.error) {
		toast({ description: response?.message?.error, type: 'error' });

		// Call the optional onError callback
		if (options?.onError) {
			options.onError();
		}
	}
}
