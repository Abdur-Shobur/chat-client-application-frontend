// features/message/messageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from './message.api-slice';

interface MessageState {
	messages: Message[];
}

const initialState: MessageState = {
	messages: [],
};

const messageSlice = createSlice({
	name: 'liveMessages',
	initialState,
	reducers: {
		setMessages(state, action: PayloadAction<Message[]>) {
			state.messages = action.payload;
		},
		addMessage(state, action: PayloadAction<Message>) {
			state.messages.push(action.payload);
		},
		clearMessages(state) {
			state.messages = [];
		},
	},
});

export const { setMessages, addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
