import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
import { UserType } from '../user';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		groups: builder.query<ApiResponse<UserType[]>, undefined>({
			query: (): string => `group`,
			providesTags: ['Users'],
		}),
		groupCreate: builder.mutation<any, { email: string; password: string }>({
			query: (payload) => ({
				url: `group`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: [],
		}),
	}),
});

export const { useGroupCreateMutation, useGroupsQuery } = api;
