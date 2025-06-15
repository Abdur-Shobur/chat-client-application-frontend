export type AuthType = {
	id: string;
	name: string;
	email: string;
	username: string;
	password: string;
	accessToken?: string;
	refreshToken?: string;
};

export type UserType = typeof data;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = {
	_id: '6749af8f96f1653316a6a656',
	name: 'admin',
	email: 'admin@gmail.com',
	createdAt: '2024-11-29T12:11:59.203Z',
	updatedAt: '2024-11-29T12:11:59.203Z',
	__v: 0,
};
