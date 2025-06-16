export const apiDelete = async ({
	id,
	deleting,
}: {
	id: string;
	deleting: any;
}) => {
	try {
		const response = await deleting(id);
	} catch (error) {
		console.error(error);
	}
};
