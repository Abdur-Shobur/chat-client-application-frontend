import { apiSlice } from '../api/apiSlice';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		group: builder.mutation<any, { email: string; password: string }>({
			query: (payload) => ({
				url: `group/login`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: [],
		}),
	}),
});

export const { useGroupMutation } = api;
