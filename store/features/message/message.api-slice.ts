import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
export interface Message {
	sender: {
		_id: string;
		name: string;
	};
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
}
export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		chat: builder.query<ApiResponse<Message[]>, undefined>({
			query: (): string => `messages/chat`,
			providesTags: ['Users'],
		}),
		getChatMessages: builder.query<
			Message[],
			{ chatType: string; targetId: string }
		>({
			query: ({ chatType, targetId }) =>
				`/messages/chat-messages/${chatType}/${targetId}`,
		}),
	}),
});

export const { useChatQuery, useGetChatMessagesQuery } = api;
