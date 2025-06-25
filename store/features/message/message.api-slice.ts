import { UserType } from '@/types';
import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
import { GroupType } from '../group/group.api-slice';

interface SenderType {
	_id: string;
	name: string;
	role?: {
		_id: string;
		name: string;
		type: string;
	};
}
export interface Message {
	sender: SenderType;
	replyTo?: Message;
	replyToUser?: SenderType;
	text: string;
	receiver: string;
	chatType: 'personal' | 'group';
	type: 'text';
	createdAt: string;
	groupInfo?: {
		_id: string;
		name: string;
	};
	userInfo?: {
		_id: string;
		name: string;
	};
	lastMessage?: {
		text: string;
		createdAt: string;
		_id: string;
	};
	_id: string;
	visibility: 'public' | 'private';
}
export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		chat: builder.query<ApiResponse<Message[]>, undefined>({
			query: (): string => `messages/chat`,
			providesTags: ['Messages'],
		}),

		infoUserOrGroup: builder.query<
			ApiResponse<GroupType | UserType>,
			{ id: string; type: string }
		>({
			query: ({ id, type }): string => `messages/info/${id}?type=${type}`,
		}),

		getChatMessages: builder.query<
			Message[],
			{ chatType: string; targetId: string; limit?: number; before?: string }
		>({
			query: ({ chatType, targetId, limit = 40, before }) => {
				const params = new URLSearchParams();
				params.append('limit', limit.toString());
				if (before) params.append('before', before);

				return `/messages/chat-messages/${chatType}/${targetId}?${params.toString()}`;
			},
			providesTags: ['Messages'],
		}),

		updateVisibility: builder.mutation<
			ApiResponse<Message>,
			{ chatId: string }
		>({
			query: ({ chatId }) => ({
				url: `/messages/toggle-visibility/${chatId}`,
				method: 'PATCH',
				body: { chatId },
			}),
			invalidatesTags: ['Messages'],
		}),
	}),
});

export const {
	useChatQuery,
	useGetChatMessagesQuery,
	useUpdateVisibilityMutation,
	useLazyGetChatMessagesQuery,
	useInfoUserOrGroupQuery,
} = api;
