import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
import { UserType } from './message.interface';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		chat: builder.query<ApiResponse<UserType[]>, undefined>({
			query: (): string => `messages/chat`,
			providesTags: ['Users'],
		}),
	}),
});

export const { useChatQuery } = api;
