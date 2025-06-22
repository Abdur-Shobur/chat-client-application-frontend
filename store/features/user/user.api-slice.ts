import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
import { UserType } from './user.interface';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		users: builder.query<ApiResponse<UserType[]>, undefined>({
			query: (): string => `user`,
			providesTags: ['Users'],
		}),

		storeUser: builder.mutation<
			UserType,
			{ username: string; password: string }
		>({
			query: (payload) => ({
				url: `users`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['Users'],
		}),

		updateUser: builder.mutation<UserType, { id: string }>({
			query: (payload) => ({
				url: `users/${payload.id}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: ['Users'],
		}),

		deleteUser: builder.mutation<UserType, string>({
			query: (id) => ({
				url: `users/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Users'],
		}),
	}),
});

export const {
	useUsersQuery,
	useStoreUserMutation,
	useDeleteUserMutation,
	useUpdateUserMutation,
} = api;
