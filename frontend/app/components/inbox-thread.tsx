'use client';
import React, { useEffect, useState } from 'react';
import socket from '@/lib/socket'; // 👈 import your socket instance
import { Button } from '@/components/ui/button';
import { Copy, Download, ThumbsDown, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useGetChatMessagesQuery } from '@/store/features/message';

export default function InboxThread({
	currentUserId,
	receiverId,
	chatType,
}: {
	currentUserId: string;
	receiverId: string;
	chatType: 'personal' | 'group';
}) {
	const [input, setInput] = useState('');

	const {
		data: initialMessages,
		isSuccess,
		refetch,
	} = useGetChatMessagesQuery({
		chatType,
		userId: currentUserId,
		targetId: receiverId,
	});

	console.log(initialMessages);

	useEffect(() => {
		socket.emit('register', currentUserId);
		socket.on('receiveMessage', (message) => {
			// dispatch(addMessage(message));
		});

		return () => {
			socket.off('receiveMessage');
		};
	}, [currentUserId, receiverId, chatType, isSuccess]);

	const handleSend = () => {
		const payload = {
			sender: currentUserId,
			receiver: receiverId,
			chatType,
			text: input,
			type: 'text',
		};
		socket.emit('sendMessage', payload);
		setInput('');
		refetch();
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{initialMessages?.map((message, index) => (
					<div
						key={index}
						className={cn(
							'flex gap-2 max-w-[80%]',
							message.sender === currentUserId && 'ml-auto'
						)}
					>
						{message.sender !== currentUserId && (
							<div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />
						)}
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">
									{message.sender === currentUserId ? 'You' : 'Them'}
								</span>
								<span className="text-sm text-muted-foreground">
									{format(new Date(message.createdAt), 'p')}
								</span>
							</div>
							<div
								className={`p-3 rounded-lg ${
									message.sender !== currentUserId
										? 'bg-muted/50'
										: 'bg-blue-100'
								}`}
							>
								<p className="text-sm whitespace-pre-wrap">{message.text}</p>
							</div>
							{message.sender !== currentUserId && (
								<div className="flex items-center gap-2">
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<Copy className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<Download className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<ThumbsUp className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<ThumbsDown className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			<div className="p-4 border-t flex gap-2">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-1 border rounded px-3 py-2"
					placeholder="Type your message..."
				/>
				<Button onClick={handleSend}>Send</Button>
			</div>
		</div>
	);
}
