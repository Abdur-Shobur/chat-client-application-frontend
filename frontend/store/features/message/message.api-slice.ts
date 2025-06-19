import { apiSlice } from '../api/apiSlice';
import { ApiResponse } from '../basic-api';
import { UserType } from './message.interface';
export interface Message {
	content: string;
	sender: string;
	receiver: string;
	chatType: 'personal' | 'group';
	type: 'text';
	createdAt: string;
}
export const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		chat: builder.query<ApiResponse<UserType[]>, undefined>({
			query: (): string => `messages/chat`,
			providesTags: ['Users'],
		}),
		getChatMessages: builder.query<
			Message[],
			{ chatType: string; userId: string; targetId: string }
		>({
			query: ({ chatType, userId, targetId }) =>
				`/messages/chat-messages/${chatType}/${userId}/${targetId}`,
		}),
	}),
});

export const { useChatQuery, useGetChatMessagesQuery } = api;
