import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
import { UserType } from '../user';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		groups: builder.query<ApiResponse<UserType[]>, undefined>({
			query: (): string => `group`,
			providesTags: ['Groups'],
		}),

		groupById: builder.query<ApiResponse<UserType[]>, { id: string }>({
			query: ({ id }): string => `group/${id}`,
			providesTags: ['Groups'],
		}),

		groupMy: builder.query<ApiResponse<UserType[]>, undefined>({
			query: (): string => `/group/my-groups`,
			providesTags: ['Groups'],
		}),

		groupCreate: builder.mutation<any, { email: string; password: string }>({
			query: (payload) => ({
				url: `group`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: [],
		}),
		groupJoin: builder.mutation<any, { groupId: string }>({
			query: (payload) => ({
				url: `group/join`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: [],
		}),
	}),
});

export const {
	useGroupsQuery,
	useGroupMyQuery,
	useGroupByIdQuery,
	useGroupJoinMutation,
	useGroupCreateMutation,
} = api;
