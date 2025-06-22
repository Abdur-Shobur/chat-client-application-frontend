import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
export interface GroupType {
	_id?: string;
	name: string;
	joinType: 'public' | 'private';
	status: 'active' | 'inactive';
	joinApprovalType: 'auto' | 'manual';
	description?: string | undefined;
	welcomeMessage?: string | undefined;
	members?: string[] | undefined;
}

export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		groups: builder.query<ApiResponse<GroupType[]>, undefined>({
			query: (): string => `group`,
			providesTags: ['Groups'],
		}),

		groupById: builder.query<ApiResponse<GroupType>, { id: string }>({
			query: ({ id }): string => `group/${id}`,
			providesTags: ['Groups'],
		}),

		groupMy: builder.query<ApiResponse<GroupType[]>, undefined>({
			query: (): string => `/group/my-groups`,
			providesTags: ['Groups'],
		}),

		groupCreate: builder.mutation<any, GroupType>({
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
