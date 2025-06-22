import { apiSlice } from '../api/apiSlice';
import { TaskType } from './task.interface';

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get all
		tasks: builder.query<TaskType[], undefined>({
			query: (): string => `tasks`,
			providesTags: ['Tasks'],
		}),

		storeTask: builder.mutation<
			TaskType,
			{ title: string; description: string }
		>({
			query: (payload) => ({
				url: `tasks`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['Tasks'],
		}),

		updateTask: builder.mutation<TaskType, { id: string }>({
			query: (payload) => ({
				url: `tasks/${payload.id}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: ['Tasks'],
		}),

		statusTask: builder.mutation<
			TaskType,
			{ id: string; status: TaskType['status'] }
		>({
			query: (payload) => ({
				url: `tasks/status/${payload.id}`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['Tasks'],
		}),

		deleteTask: builder.mutation<TaskType, string>({
			query: (id) => ({
				url: `tasks/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Tasks'],
		}),
	}),
});

export const {
	useTasksQuery,
	useStoreTaskMutation,
	useDeleteTaskMutation,
	useUpdateTaskMutation,
	useStatusTaskMutation,
} = api;
