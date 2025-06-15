export type TaskType = {
	id: string;
	title: string;
	description: string;
	status: 'pending' | 'in-progress' | 'done';
};
