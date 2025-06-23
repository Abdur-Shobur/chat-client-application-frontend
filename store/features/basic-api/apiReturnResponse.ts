export type ApiResponse<T> = {
	statusCode: number;
	success: boolean;
	status: boolean;
	message: string;
	data: T;
};
