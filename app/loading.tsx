export default function Loading() {
	// Or a custom loading skeleton component
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-blue-600" />
		</div>
	);
}
