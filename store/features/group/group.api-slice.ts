import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
export interface GroupType {
	_id?: string;
	name: string;
	createdBy: string;
	joinType: 'public' | 'private';
	status: 'active' | 'inactive';
	joinApprovalType: 'auto' | 'manual';
	description?: string | undefined;
	welcomeMessage?: string | undefined;
	members?: string[] | undefined;
	leaveMembers?: string[] | undefined;
	createdAt?: any;
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

		getMemberDetails: builder.query<ApiResponse<GroupType>, { id: string }>({
			query: ({ id }): string => `group/members/${id}`,
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
			invalidatesTags: ['Groups', 'Messages'],
		}),

		groupUpdate: builder.mutation<any, any>({
			query: (payload) => ({
				url: `group/${payload.id}`,
				method: 'PATCH',
				body: payload,
			}),
			invalidatesTags: ['Groups'],
		}),
		groupLeave: builder.mutation<any, { id: string }>({
			query: (payload) => ({
				url: `group/leave/${payload.id}`,
				method: 'PATCH',
				body: payload,
			}),
			invalidatesTags: ['Groups', 'Messages'],
		}),

		memberRemove: builder.mutation<any, { groupId: string; userId: string }>({
			query: (payload) => ({
				url: `group/remove-member/${payload.groupId}`,
				method: 'PATCH',
				body: payload,
			}),
			invalidatesTags: ['Groups'],
		}),

		groupJoin: builder.mutation<ApiResponse<any>, { groupId: string }>({
			query: (payload) => ({
				url: `group/join`,
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['Groups', 'Messages'],
		}),
	}),
});

export const {
	useGroupsQuery,
	useGroupMyQuery,
	useGroupByIdQuery,
	useGroupJoinMutation,
	useMemberRemoveMutation,
	useGroupCreateMutation,
	useGroupUpdateMutation,
	useGetMemberDetailsQuery,
	useGroupLeaveMutation,
} = api;
