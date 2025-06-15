export const apiDelete = async ({
	id,
	deleting,
}: {
	id: string;
	deleting: any;
}) => {
	try {
		const response = await deleting(id);
		console.log(response);
	} catch (error) {
		console.error(error);
	}
};
