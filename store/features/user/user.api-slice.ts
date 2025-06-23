import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
import { UserType } from './user.interface';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		users: builder.query<ApiResponse<UserType[]>, undefined>({
			query: (): string => `user`,
			providesTags: ['Users'],
		}),

		user: builder.query<ApiResponse<UserType>, { id: string }>({
			query: ({ id }) => `user/${id}`,
			providesTags: ['Users'],
		}),

		storeUser: builder.mutation<
			UserType,
			{ username: string; password: string }
		>({
			query: (payload) => ({
				url: `user`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['Users'],
		}),

		updateUser: builder.mutation<ApiResponse<UserType>, any>({
			query: (payload) => ({
				url: `user/update/${payload.id}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: ['Users'],
		}),

		statusUser: builder.mutation<
			ApiResponse<UserType>,
			{ id: string; status: string }
		>({
			query: (payload) => ({
				url: `user/status/${payload.id}`,
				method: 'PATCH',
				body: payload,
			}),
			invalidatesTags: ['Users'],
		}),

		deleteUser: builder.mutation<ApiResponse<UserType>, string>({
			query: (id) => ({
				url: `user/delete/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Users'],
		}),
	}),
});

export const {
	useUsersQuery,
	useUserQuery,
	useStatusUserMutation,
	useStoreUserMutation,
	useDeleteUserMutation,
	useUpdateUserMutation,
} = api;
