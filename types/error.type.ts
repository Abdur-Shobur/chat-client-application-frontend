// Define the error response type (you can adjust this based on your actual error structure)
export interface ApiErrorResponseType {
	message: string;
	statusCode: number;
	success: boolean;
	errorMessages?: ErrorMessage[];
}
export type ErrorMessage = {
	path: string | number;
	message: string;
};
