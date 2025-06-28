'use client';

import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from 'react';
import {
	Message,
	useChatQuery,
	useGetChatMessagesQuery,
	useInfoUserOrGroupQuery,
} from '@/store/features/message';
import { format } from 'date-fns/format';
import { ChevronLeft, Copy, Eye, EyeOff, Inbox, Reply, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { connectSocket, getSocket } from '@/lib/socketClient';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { GroupInfo } from '@/store/features/group/group-info-modal';
import { Alert, AlertTitle } from '@/components/ui/alert';
import GroupLeave from '@/store/features/group/group.leave';

// Types for better type safety
interface MessageActionProps {
	message: Message;
	currentUserId: string;
	userRole: string;
	chatType: string;
	onCopy: (text: string) => void;
	onReply: (message: Message) => void;
	onToggleVisibility: (
		messageId: string,
		visibility: 'public' | 'private'
	) => void;
}

interface MessageItemProps extends MessageActionProps {
	isCurrentUser: boolean;
	canMessageUser: boolean;
}

interface ReplyPreviewProps {
	replyMessage: Message | null;
	onCancel: () => void;
}

interface ChatHeaderProps {
	userOrGroupInfo: any;
	chatType: string;
	userRole: string;
	groupId?: string;
	onBack: () => void;
}

// Constants
const SCROLL_THRESHOLD = 100;
const SCROLL_DELAY = 100;
const CHAT_HEIGHT_MOBILE = 'h-[calc(100vh-150px)]';
const CHAT_HEIGHT_DESKTOP = 'md:h-[calc(100vh-230px)]';

/**
 * Reusable component for displaying reply preview
 */
const ReplyPreview: React.FC<ReplyPreviewProps> = ({
	replyMessage,
	onCancel,
}) => {
	if (!replyMessage) return null;

	return (
		<div className="absolute -top-11 left-0 w-full h-auto bg-gray-200 p-1 rounded-md text-xs">
			<p className="font-semibold">{replyMessage.sender.name}</p>
			<p>{replyMessage.text}</p>
			<button
				type="button"
				className="absolute top-1 right-1"
				onClick={onCancel}
				aria-label="Cancel reply"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
};

/**
 * Reusable component for message actions (copy, reply, visibility toggle)
 */
const MessageActions: React.FC<MessageActionProps> = ({
	message,
	currentUserId,
	userRole,
	chatType,
	onCopy,
	onReply,
	onToggleVisibility,
}) => {
	// Only show actions if user is admin and it's not their own message
	if (userRole !== 'admin' || message.sender?._id === currentUserId) {
		return null;
	}

	return (
		<div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8"
				onClick={() => onCopy(message.text || '')}
				aria-label="Copy message"
			>
				<Copy className="h-4 w-4" />
			</Button>

			<Button
				type="button"
				onClick={() => onReply(message)}
				variant="ghost"
				size="icon"
				className="h-8 w-8"
				aria-label="Reply to message"
			>
				<Reply className="h-4 w-4" />
			</Button>

			{chatType === 'group' && (
				<Button
					aria-label="Toggle visibility"
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => onToggleVisibility(message._id, message.visibility)}
				>
					{message.visibility === 'public' ? (
						<Eye className="text-green-500" />
					) : (
						<EyeOff className="text-red-500" />
					)}
				</Button>
			)}
		</div>
	);
};

/**
 * Reusable component for individual message item
 */
const MessageItem: React.FC<MessageItemProps> = ({
	message,
	currentUserId,
	userRole,
	chatType,
	isCurrentUser,
	canMessageUser,
	onCopy,
	onReply,
	onToggleVisibility,
}) => {
	const renderUserAvatar = () => {
		if (isCurrentUser) return null;

		return canMessageUser ? (
			<Link
				href={`/${message?.sender?._id}?type=personal`}
				className="h-8 w-8 rounded-full bg-primary flex-shrink-0"
			/>
		) : (
			<div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
		);
	};

	return (
		<div className="group flex gap-2">
			{renderUserAvatar()}

			<div
				className={cn(
					message.replyTo ? 'space-y-0' : 'space-y-2',
					isCurrentUser && 'ml-auto'
				)}
			>
				{/* Message header with sender info and actions */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium capitalize">
						{isCurrentUser ? 'You' : message.sender?.name || 'Unknown'}
					</span>

					<span className="text-sm text-muted-foreground">
						{format(new Date(message.createdAt), 'p')}
					</span>

					<MessageActions
						message={message}
						currentUserId={currentUserId}
						userRole={userRole}
						chatType={chatType}
						onCopy={onCopy}
						onReply={onReply}
						onToggleVisibility={onToggleVisibility}
					/>
				</div>

				{/* Phone number for non-current users */}
				{!isCurrentUser && (
					<span className="text-xs font-medium">{message.sender.phone}</span>
				)}

				{/* Reply preview */}
				{message.replyTo && (
					<div className="p-1 rounded-lg rounded-br-none bg-muted text-xs whitespace-pre-wrap opacity-65">
						<p className="font-semibold">{message.replyTo.sender?.name}</p>
						<p className="text-xs">{message.replyTo.text}</p>
					</div>
				)}

				{/* Message content */}
				<div
					className={`p-2 sm:p-3 rounded-lg rounded-br-none ${
						!isCurrentUser ? 'bg-muted/50' : 'bg-blue-100'
					}`}
				>
					<p className="text-sm whitespace-pre-wrap">{message.text}</p>
				</div>
			</div>
		</div>
	);
};

/**
 * Reusable component for chat header
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({
	userOrGroupInfo,
	chatType,
	userRole,
	groupId,
	onBack,
}) => {
	return (
		<>
			<div className="flex items-start px-4 py-3 gap-2">
				<Button
					className="lg:hidden"
					variant="outline"
					size="icon"
					onClick={onBack}
				>
					<ChevronLeft size={20} />
				</Button>

				<div className="flex items-center gap-4 text-sm">
					{chatType === 'group' && userRole === 'admin' && groupId ? (
						<GroupInfo userOrGroupInfo={userOrGroupInfo} groupId={groupId} />
					) : (
						<Avatar>
							<AvatarImage alt={userOrGroupInfo?.data.name} />
							<AvatarFallback className="capitalize">
								{userOrGroupInfo?.data.name
									?.split(' ')
									.map((chunk: string) => chunk[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
					)}

					<div className="font-semibold capitalize">
						{userOrGroupInfo?.data.name}
					</div>

					{chatType === 'group' &&
						userOrGroupInfo?.data.name &&
						userRole !== 'admin' && <GroupLeave id={groupId || ''} />}
				</div>
			</div>
			<Separator />
		</>
	);
};

/**
 * Custom hook for socket management
 */
const useSocketConnection = (
	session: any,
	params: any,
	type: string,
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
	messagesEndRef: React.RefObject<HTMLDivElement>
) => {
	const socketRef = useRef<any>(null);

	useEffect(() => {
		if (!session?.user?.id) return;

		const setupSocket = async () => {
			try {
				// Clean up existing socket first
				if (socketRef.current) {
					socketRef.current.disconnect();
					socketRef.current = null;
				}

				const socket = await connectSocket();
				if (!socket || !session) {
					console.error('❌ Socket connection failed');
					return;
				}

				socketRef.current = socket;
				socket.emit('register', session.user.id);

				// Handle incoming messages
				const handleReceiveMessage = (message: any) => {
					console.log('📨 Received message:', message);

					// Check if this message belongs to current chat
					const isRelevantMessage =
						type === 'group'
							? message?.receiver === params.id
							: message?.sender._id === params.id;

					if (isRelevantMessage) {
						setMessages((prev) => {
							// Prevent duplicate messages
							const exists = prev.some(
								(existingMsg) => existingMsg._id === message._id
							);
							if (exists) {
								console.log('Message already exists, not adding duplicate');
								return prev;
							}

							console.log('Adding new message to state');
							return [...prev, message];
						});

						// Auto-scroll to bottom for new messages
						setTimeout(() => {
							if (messagesEndRef.current) {
								messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
							}
						}, 100);
					}
				};

				// Handle visibility updates
				const handleVisibilityUpdate = (data: any) => {
					console.log('👁️ Visibility update received:', data);

					if (data && data.messageId) {
						setMessages((prev) => {
							const updated = prev.map((msg) =>
								msg._id === data.messageId
									? { ...msg, visibility: data.visibility }
									: msg
							);
							console.log('Updated messages with new visibility');
							return updated;
						});
					}
				};

				// Handle socket events
				socket.on('receiveMessage', handleReceiveMessage);
				socket.on('visibilityUpdated', handleVisibilityUpdate);

				// Handle connection events for debugging
				socket.on('connect', () => {
					console.log('✅ Socket connected');
				});

				socket.on('disconnect', (reason) => {
					console.log('❌ Socket disconnected:', reason);
				});

				return () => {
					socket.off('receiveMessage', handleReceiveMessage);
					socket.off('visibilityUpdated', handleVisibilityUpdate);
					socket.off('connect');
					socket.off('disconnect');
					socket.disconnect();
					socketRef.current = null;
				};
			} catch (err) {
				console.error('Socket setup failed:', err);
			}
		};

		let cleanupFn: (() => void) | undefined;

		setupSocket().then((cleanup) => {
			cleanupFn = cleanup;
		});

		return () => {
			if (cleanupFn) cleanupFn();
		};
	}, [session?.user?.id, params.id, type, setMessages, messagesEndRef]);

	// Return the socket ref for external use
	return socketRef;
};

/**
 * Custom hook for scroll management
 */
const useScrollManagement = (
	scrollContainerRef: React.RefObject<HTMLDivElement>,
	messagesEndRef: React.RefObject<HTMLDivElement>,
	messages: Message[],
	page: number,
	isFetching: boolean,
	initialMessages: any,
	setPage: React.Dispatch<React.SetStateAction<number>>
) => {
	const oldScrollHeight = useRef(0);

	// Auto-scroll to bottom for new messages
	useEffect(() => {
		if (messagesEndRef.current && page === 1 && messages.length > 0) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, page]);

	// Maintain scroll position when loading older messages
	useEffect(() => {
		const scrollEl = scrollContainerRef.current;
		if (!scrollEl) return;

		if (page === 1) {
			scrollEl.scrollTop = scrollEl.scrollHeight;
		} else {
			scrollEl.scrollTop = scrollEl.scrollHeight - oldScrollHeight.current;
		}
	}, [messages, page]);

	// Infinite scroll for loading older messages
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const onScroll = () => {
			const canLoadMore =
				container.scrollTop < SCROLL_THRESHOLD &&
				!isFetching &&
				initialMessages?.data.meta.currentPage <
					initialMessages?.data.meta.totalPages;

			if (canLoadMore) {
				oldScrollHeight.current = container.scrollHeight;
				setPage((prev) => prev + 1);
			}
		};

		container.addEventListener('scroll', onScroll);
		return () => container.removeEventListener('scroll', onScroll);
	}, [isFetching, initialMessages, setPage]);
};

/**
 * Main MailDisplay component
 */
export function MailDisplay() {
	// Refs
	const formRef = useRef<HTMLFormElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

	// Hooks
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();
	const { data: session, status } = useSession();

	// State
	const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [page, setPage] = useState(1);

	// Derived values
	const chatType = searchParams.get('type') || 'personal';
	const targetId = params.id.toString();
	const currentUserId = session?.user?.id || '';
	const userRole = session?.user?.role || '';

	// API queries
	const {
		data: initialMessages,
		isSuccess,
		isLoading,
		error,
		isFetching,
	} = useGetChatMessagesQuery({
		chatType,
		targetId,
		page,
	});

	const { refetch: refetchMessages } = useChatQuery(undefined);

	const { data: userOrGroupInfo } = useInfoUserOrGroupQuery({
		id: targetId,
		type: chatType,
	});

	// Reset messages when switching chats
	useEffect(() => {
		console.log('🔄 Chat context changed, resetting messages');
		setMessages([]);
		setPage(1);
		setReplyToMessage(null);
		setInput('');
	}, [targetId, chatType]);

	// Custom hooks
	const socketRef = useSocketConnection(
		session,
		params,
		chatType,
		setMessages,
		messagesEndRef
	);
	useScrollManagement(
		scrollContainerRef,
		messagesEndRef,
		messages,
		page,
		isFetching,
		initialMessages,
		setPage
	);

	// Update messages when new data arrives
	useEffect(() => {
		if (isSuccess && initialMessages) {
			setMessages((prev) => {
				const newMessages = initialMessages.data.data.filter(
					(msg: Message) => !prev.some((existing) => existing._id === msg._id)
				);

				// If this is the first page, replace all messages
				if (page === 1 && newMessages.length > 0) {
					console.log('📥 Setting initial messages for page 1');
					return [...newMessages];
				}

				// For subsequent pages, prepend new messages
				if (newMessages.length > 0) {
					console.log('📥 Adding older messages for page', page);
					return [...newMessages, ...prev];
				}

				return prev;
			});
		}
	}, [initialMessages, isSuccess, page]);

	// Memoized values for performance
	const canUserMessageSender = useCallback(
		(senderRole: string, senderId: string) => {
			if (senderId === currentUserId) return false;
			return userRole === 'admin' || senderRole === 'admin';
		},
		[userRole, currentUserId]
	);

	// Event handlers
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			const isEnter = e.key === 'Enter';
			const isShift = e.shiftKey;
			const isCtrlOrCmd = e.ctrlKey || e.metaKey;
			const isTextarea = e.currentTarget.tagName === 'TEXTAREA';

			// Allow newline in textarea with Shift+Enter
			if (isEnter && isShift && isTextarea) return;

			// Submit conditions
			const shouldSubmit =
				(isEnter && !isShift && isTextarea) ||
				(isEnter && !isTextarea) ||
				(isCtrlOrCmd && isEnter);

			if (shouldSubmit) {
				e.preventDefault();
				formRef.current?.requestSubmit();
			}
		},
		[]
	);

	const handleSend = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (!input.trim() || !currentUserId) return;

			// Use the socket from our ref first, fallback to getSocket()
			let socket = socketRef.current;

			if (!socket || !socket.connected) {
				console.warn('Socket not connected from ref, trying getSocket()...');
				socket = getSocket();
			}

			// If still no socket, try to reconnect
			if (!socket || !socket.connected) {
				console.warn('No socket available, attempting to reconnect...');
				try {
					socket = await connectSocket();
				} catch (err) {
					console.error('❌ Could not connect socket:', err);
					return;
				}
			}

			if (!socket?.connected) {
				console.error('❌ Socket still not connected');
				return;
			}

			// Generate a unique temporary ID for optimistic update
			const tempId = `temp_${Date.now()}_${Math.random()}`;

			// Build message payload
			const newMessage = {
				sender: currentUserId,
				receiver: targetId,
				chatType: chatType as 'group' | 'personal',
				text: input,
				type: 'text',
				visibility:
					userRole === 'admin'
						? replyToMessage
							? 'private'
							: 'public'
						: 'private',
				createdAt: new Date().toISOString(),
				...(replyToMessage && {
					replyTo: replyToMessage._id,
					replyToUser: replyToMessage.sender._id,
				}),
			};

			console.log('📤 Sending message:', newMessage);

			// Optimistic UI update with temporary ID
			const optimisticMessage: Message = {
				...newMessage,
				_id: tempId,
				visibility: 'private',
				replyToUser: replyToMessage?.sender,
				replyTo: replyToMessage ?? undefined,
				type: 'text' as const,
				sender: {
					_id: currentUserId,
					name: 'You',
					phone: '',
				},
			};

			// Add optimistic message immediately
			setMessages((prev) => [...prev, optimisticMessage]);

			// Reset form state
			setReplyToMessage(null);
			setInput('');
			(e.target as HTMLFormElement).reset();

			// Send via socket
			socket.emit('sendMessage', newMessage);

			// Auto-scroll to bottom
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
			}, SCROLL_DELAY);

			// Refetch messages to ensure consistency (optional)
			setTimeout(() => {
				refetchMessages();
			}, 1000);
		},
		[
			input,
			currentUserId,
			targetId,
			chatType,
			userRole,
			replyToMessage,
			refetchMessages,
			socketRef,
		]
	);

	const handleToggleVisibility = useCallback(
		async (messageId: string, currentVisibility: 'public' | 'private') => {
			// Use the socket from our ref first, fallback to getSocket()
			let socket = socketRef.current;

			if (!socket || !socket.connected) {
				console.warn('Socket not connected from ref, trying getSocket()...');
				socket = getSocket();
			}

			if (!socket?.connected) {
				console.warn('No socket available, attempting to reconnect...');
				try {
					socket = await connectSocket();
				} catch (err) {
					console.error('Socket not connected:', err);
					return;
				}
			}

			const newVisibility =
				currentVisibility === 'public' ? 'private' : 'public';

			console.log('🔄 Toggling visibility:', {
				messageId,
				from: currentVisibility,
				to: newVisibility,
			});

			// Optimistic update first
			setMessages((prev) =>
				prev.map((msg) =>
					msg._id === messageId ? { ...msg, visibility: newVisibility } : msg
				)
			);

			// Send to server
			if (socket) {
				socket.emit('toggleVisibility', {
					messageId,
					visibility: newVisibility,
				});
			}
		},
		[socketRef]
	);

	const handleCopyMessage = useCallback((text: string) => {
		navigator.clipboard.writeText(text);
	}, []);

	const handleReplyToMessage = useCallback((message: Message) => {
		setReplyToMessage(message);
		inputRef.current?.focus();
	}, []);

	// Loading states
	if (status === 'loading') {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-blue-600" />
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Please log in to view messages.</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-1 flex-col">
				{/* Chat Header */}
				<ChatHeader
					userOrGroupInfo={userOrGroupInfo}
					chatType={chatType}
					userRole={userRole}
					groupId={(userOrGroupInfo?.data as any)?._id}
					onBack={() => router.back()}
				/>

				{/* Messages Container */}
				<div
					ref={scrollContainerRef}
					className={`${CHAT_HEIGHT_MOBILE} ${CHAT_HEIGHT_DESKTOP} overflow-y-auto`}
				>
					<div className="flex flex-col gap-2 p-4 max-w-[90%] mx-auto">
						<div className="flex flex-col h-full">
							<div className="flex-1 space-y-4 overflow-y-auto sm:p-4">
								{/* Loading indicator */}
								{(isLoading || isFetching) && (
									<div className="flex items-center justify-center">
										<div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-blue-600" />
									</div>
								)}

								{/* Messages */}
								{!isLoading &&
									messages.map((message, index) => (
										<MessageItem
											key={`${message._id}-${index}`}
											message={message}
											currentUserId={currentUserId}
											userRole={userRole}
											chatType={chatType}
											isCurrentUser={message.sender?._id === currentUserId}
											canMessageUser={canUserMessageSender(
												message.sender?.role?.type || '',
												message.sender?._id || ''
											)}
											onCopy={handleCopyMessage}
											onReply={handleReplyToMessage}
											onToggleVisibility={handleToggleVisibility}
										/>
									))}

								{/* Empty state */}
								{!isLoading && messages.length === 0 && (
									<Alert className="flex gap-2 align-center">
										<Inbox className="h-4 w-4 !top-3" />
										<AlertTitle className="mb-0">
											{(error && (error as any)?.data?.message) ||
												'No messages found'}
										</AlertTitle>
									</Alert>
								)}
							</div>
						</div>
					</div>
					<div ref={messagesEndRef} />
				</div>

				{/* Message Input */}
				{!error && (
					<>
						<Separator className="mt-auto" />
						<div className="p-4">
							<form ref={formRef} onSubmit={handleSend}>
								<div className="flex md:grid gap-4 relative">
									<ReplyPreview
										replyMessage={replyToMessage}
										onCancel={() => setReplyToMessage(null)}
									/>

									{/* Mobile Input */}
									<Input
										ref={inputRef as React.RefObject<HTMLInputElement>}
										value={input}
										onChange={(e) => setInput(e.target.value)}
										name="message"
										onKeyDown={handleKeyDown}
										className="md:hidden md:invisible flex-1"
										placeholder="Type your message..."
									/>

									{/* Desktop Textarea */}
									<Textarea
										ref={inputRef as React.RefObject<HTMLTextAreaElement>}
										value={input}
										onChange={(e) => setInput(e.target.value)}
										name="message"
										onKeyDown={handleKeyDown}
										className="hidden invisible md:visible md:block resize-none"
										placeholder="Type your message..."
									/>

									<div className="flex items-end">
										<Button type="submit" size="sm" className="ml-auto">
											Send
										</Button>
									</div>
								</div>
							</form>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
