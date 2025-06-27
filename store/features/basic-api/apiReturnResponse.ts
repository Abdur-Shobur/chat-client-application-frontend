export type ApiResponse<T> = {
	statusCode: number;
	success: boolean;
	status: boolean;
	message: string;
	data: T;
};
export type ApiResponseMeta<T> = {
	status: boolean;
	message: string;
	data: {
		data: T;
		meta: {
			total: number;
			totalPages: number;
			currentPage: number;
			pageSize: number;
		};
	};
	statusCode: number;
};
