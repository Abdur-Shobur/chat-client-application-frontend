'use client';
import React, { useEffect, useRef } from 'react';
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
// import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { connectSocket, getSocket } from '@/lib/socketClient';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { GroupInfo } from '@/store/features/group/group-info-modal';
import { Alert, AlertTitle } from '@/components/ui/alert';
import GroupLeave from '@/store/features/group/group.leave';

export function MailDisplay() {
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const params = useParams();
	const [personalMessage, setPersonalMessage] = useState<Message | null>(null);
	const [input, setInput] = useState('');
	const { data: session, status } = useSession();
	const searchParams = useSearchParams();
	const type = searchParams.get('type') || 'personal';
	const messagesEndRef = React.useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const oldScrollHeight = useRef(0);
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
	const [page, setPage] = useState(1);
	const {
		data: initialMessages,
		isSuccess,
		isLoading,
		error,
		isFetching,
	} = useGetChatMessagesQuery({
		chatType: searchParams.get('type') || 'personal',
		targetId: params.id.toString(),
		page,
	});

	const { refetch: refetchMessages } = useChatQuery(undefined);

	const { data: userOrGroupInfo, isLoading: isLoadingUserOrGroup } =
		useInfoUserOrGroupQuery({
			id: params.id.toString(),
			type: searchParams.get('type') || 'personal',
		});

	useEffect(() => {
		if (messagesEndRef.current && page === 1 && messages.length > 0) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	useEffect(() => {
		if (isSuccess && initialMessages) {
			setMessages((prev) => {
				const newMessages = initialMessages.data.data.filter(
					(msg) => !prev.some((existing) => existing._id === msg._id)
				);
				return [...newMessages, ...prev];
			});
		}
	}, [initialMessages, isSuccess]);

	// Scroll management on messages change
	useEffect(() => {
		const scrollEl = scrollContainerRef.current;

		if (!scrollEl) return;

		if (page === 1) {
			// On first load or new chat, scroll to bottom
			scrollEl.scrollTop = scrollEl.scrollHeight;
		} else {
			// Maintain scroll position after loading older messages
			scrollEl.scrollTop = scrollEl.scrollHeight - oldScrollHeight.current;
		}
	}, [messages]);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const onScroll = () => {
			if (
				container.scrollTop < 100 &&
				!isFetching &&
				initialMessages?.data.meta.currentPage !== undefined &&
				initialMessages?.data.meta.totalPages !== undefined &&
				initialMessages?.data.meta.currentPage <
					initialMessages?.data.meta.totalPages
			) {
				oldScrollHeight.current = container.scrollHeight;
				setPage((prev) => prev + 1);
			}
		};

		container.addEventListener('scroll', onScroll);
		return () => container.removeEventListener('scroll', onScroll);
	}, [isFetching, initialMessages]);

	useEffect(() => {
		const setupSocket = async () => {
			try {
				const socket = await connectSocket();
				if (!socket || !session) {
					console.error('❌ Socket connection failed');
					return;
				}

				socket.emit('register', session.user.id);

				const handleReceiveMessage = (message: any) => {
					if (
						type === 'group'
							? message?.receiver !== params.id
							: message?.sender._id !== params.id
					) {
						return;
					}
					return setMessages((prev) => [...prev, message]);
				};
				const handleVisibilityUpdate = (message: any) => {
					console.log('message', message);
					if (message) {
						setMessages((prev) =>
							prev.map((msg) =>
								msg._id === message._id
									? { ...msg, visibility: message.visibility }
									: msg
							)
						);
					}
				};
				socket.on('visibilityUpdated', handleVisibilityUpdate);
				socket.on('receiveMessage', handleReceiveMessage);

				// Move this cleanup into the outer scope so useEffect can return it
				return () => {
					socket.off('receiveMessage', handleReceiveMessage);
					socket.off('visibilityUpdated', handleVisibilityUpdate);
					socket.disconnect();
				};
			} catch (err) {
				console.error('Socket setup failed:', err);
			}
		};

		let cleanupFn: () => void;

		if (session?.user?.id) {
			setupSocket().then((cleanup) => {
				cleanupFn = cleanup!;
			});
		}

		return () => {
			if (cleanupFn) cleanupFn();
		};
	}, [session?.user?.id]);

	if (status === 'loading') {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-blue-600" />
			</div>
		);
	}

	if (!session || !session.user) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Please log in to view messages.</p>
			</div>
		);
	}
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		const isEnter = e.key === 'Enter';
		const isShift = e.shiftKey;
		const isCtrlOrCmd = e.ctrlKey || e.metaKey;

		// If Shift+Enter, allow newline in Textarea (but only in Textarea)
		if (isEnter && isShift && e.currentTarget.tagName === 'TEXTAREA') {
			return; // Let default behavior (newline in textarea)
		}

		// Submit on Enter (without Shift) or Ctrl/Cmd+Enter
		if (
			(isEnter && !isShift && e.currentTarget.tagName === 'TEXTAREA') || // Enter in textarea
			(isEnter && e.currentTarget.tagName === 'INPUT') || // Enter in input
			(isCtrlOrCmd && isEnter)
		) {
			e.preventDefault();
			formRef.current?.requestSubmit();
		}
	};

	const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!input.trim() || !session?.user?.id) return;

		let socket = getSocket();

		if (!socket || !socket.connected) {
			console.warn('Socket not connected. Attempting to reconnect...');

			try {
				socket = await connectSocket();
			} catch (err) {
				console.error('❌ Could not reconnect socket:', err);
				return;
			}
		}

		if (!socket || !socket.connected) {
			console.error('❌ Socket still not connected after retry');
			return;
		}

		// Build message with reply info if available
		const newMessage = {
			sender: session.user.id,
			receiver: params.id.toString(),
			chatType:
				searchParams.get('type') === 'personal'
					? 'personal'
					: ('group' as 'group' | 'personal'),
			text: input,
			type: 'text',
			visibility:
				session.user.role === 'admin'
					? personalMessage
						? 'private'
						: 'public'
					: 'private',
			createdAt: new Date().toISOString(),

			// Add replyTo and replyToUser if replying
			...(personalMessage
				? {
						replyTo: personalMessage._id,
						replyToUser: personalMessage.sender._id,
				  }
				: {}),
		};

		console.log(newMessage);

		socket.emit('sendMessage', newMessage);

		// Optimistically update UI including reply info
		const messageUpdate: Message = {
			...newMessage,
			_id: new Date().toISOString(),
			visibility: 'private',
			replyToUser: personalMessage?.sender,
			replyTo: personalMessage ?? undefined,
			type: 'text' as 'text',
			sender: {
				_id: session.user.id,
				name: 'You',
				phone: '',
			},
		};

		setMessages((prevMessages) => [...prevMessages, messageUpdate]);

		// Clear reply state after sending
		setPersonalMessage(null);

		// Reset input and refetch
		(e.target as HTMLFormElement).reset();
		setInput('');
		refetchMessages();

		// 👇 Scroll to bottom
		setTimeout(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);
	};

	const handleToggleVisibility = async (
		messageId: string,
		currentVisibility: 'public' | 'private'
	) => {
		let socket = getSocket();

		if (!socket || !socket.connected) {
			try {
				socket = await connectSocket();
			} catch (err) {
				console.error('Socket not connected:', err);
				return;
			}
		}

		const newVisibility = currentVisibility === 'public' ? 'private' : 'public';

		if (socket) {
			socket.emit('toggleVisibility', {
				messageId,
				visibility: newVisibility,
			});

			console.log('fire');

			setMessages((prev) =>
				prev.map((msg) =>
					msg._id === messageId ? { ...msg, visibility: newVisibility } : msg
				)
			);
		}
	};

	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-1 flex-col">
				<div className="flex items-start px-4 py-3 gap-2">
					{session.user.role === 'admin' && (
						<Button
							className="lg:hidden"
							variant="outline"
							size="icon"
							onClick={() => router.back()}
						>
							<ChevronLeft size={20} />
						</Button>
					)}

					<div className="flex items-center gap-4 text-sm">
						{type === 'group' && session.user.role === 'admin' ? (
							<GroupInfo
								userOrGroupInfo={userOrGroupInfo}
								groupId={(userOrGroupInfo?.data as any)?._id}
							/>
						) : (
							<Avatar>
								<AvatarImage alt={userOrGroupInfo?.data.name} />
								<AvatarFallback className="capitalize">
									{userOrGroupInfo?.data.name
										.split(' ')
										.map((chunk) => chunk[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
						)}

						<div className="font-semibold capitalize">
							{userOrGroupInfo?.data.name}
						</div>
						<div className=" gap-1 hidden">
							<div className="font-semibold capitalize">
								{userOrGroupInfo?.data.name}
							</div>
							<div className="line-clamp-1 text-xs">
								<span className="font-medium">
									{userOrGroupInfo?.data.status}
								</span>
							</div>
						</div>
						{type === 'group' &&
							userOrGroupInfo?.data.name &&
							session.user.role !== 'admin' && (
								<GroupLeave id={params.id.toString()} />
							)}
					</div>
				</div>
				<Separator />
				<div
					ref={scrollContainerRef}
					className="h-[calc(100vh-150px)] md:h-[calc(100vh-230px)] overflow-y-auto"
				>
					<div className="flex flex-col gap-2 p-4  max-w-[90%] mx-auto">
						<div className="flex flex-col h-full">
							<div className=" flex-1 space-y-4 overflow-y-auto sm:p-4">
								{(isLoading || isFetching) && (
									<div className="flex items-center justify-center">
										<div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-blue-600" />
									</div>
								)}
								{!isLoading &&
									messages?.map((message, index) => (
										<div key={index} className={'group flex gap-2'}>
											{message.sender?._id !== session?.user.id &&
												// If current user is admin, allow messaging anyone
												(session?.user.role === 'admin' ? (
													<Link
														href={`/${message?.sender?._id}?type=personal`}
														className="h-8 w-8 rounded-full bg-primary flex-shrink-0"
													/>
												) : // If current user is NOT admin, only allow messaging an admin
												message.sender?.role?.type === 'admin' ? (
													<Link
														href={`/${message?.sender?._id}?type=personal`}
														className="h-8 w-8 rounded-full bg-primary flex-shrink-0"
													/>
												) : (
													// User is not admin, and sender is not admin — do not allow messaging
													<div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
												))}

											<div
												className={cn(
													message.replyTo ? 'space-y-0 ' : 'space-y-2 ',
													message.sender?._id === session?.user.id && 'ml-auto'
												)}
											>
												<div className="flex items-center gap-2">
													<span className="text-sm font-medium capitalize">
														{message.sender?._id === session?.user.id
															? 'You'
															: message.sender?.name || 'Unknown'}
													</span>

													<span className="text-sm text-muted-foreground">
														{format(new Date(message.createdAt), 'p')}
													</span>
													{session?.user.role === 'admin' &&
														message.sender?._id !== session?.user.id && (
															<div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-8 w-8"
																	onClick={() => {
																		navigator.clipboard.writeText(
																			message.text || ''
																		);
																	}}
																>
																	<Copy className="h-4 w-4" />
																</Button>

																<Button
																	type="button"
																	onClick={() => {
																		setPersonalMessage(message);
																		if (inputRef.current) {
																			inputRef.current.focus();
																		}
																	}}
																	variant="ghost"
																	size="icon"
																	className="h-8 w-8"
																>
																	<Reply className="h-4 w-4" />
																</Button>

																{type === 'group' && (
																	<Button
																		aria-label="Toggle visibility"
																		variant="ghost"
																		size="icon"
																		className="h-8 w-8"
																		onClick={() =>
																			handleToggleVisibility(
																				message._id,
																				message.visibility
																			)
																		}
																	>
																		{message.visibility === 'public' ? (
																			<Eye className="text-green-500" />
																		) : (
																			<EyeOff className="text-red-500" />
																		)}
																	</Button>
																)}
															</div>
														)}
												</div>

												{message.sender?._id !== session?.user.id && (
													<span className="text-xs font-medium ">
														{message.sender.phone}
													</span>
												)}
												{message.replyTo && (
													<div className="p-1 rounded-lg rounded-br-none bg-muted text-xs whitespace-pre-wrap opacity-65 ">
														<p className="font-semibold">
															{message.replyTo.sender?.name}
														</p>
														<p className="text-xs">{message.replyTo.text}</p>
													</div>
												)}
												<div
													className={`p-2 sm:p-3 rounded-lg rounded-br-none ${
														message.sender?._id !== session?.user.id
															? 'bg-muted/50'
															: 'bg-blue-100'
													}`}
												>
													<p className="text-sm whitespace-pre-wrap">
														{message.text}
													</p>
												</div>
											</div>
										</div>
									))}

								{!isLoading && messages?.length === 0 && (
									<div>
										<Alert className="flex gap-2 align-center ">
											<Inbox className="h-4 w-4 !top-3" />
											<AlertTitle className="mb-0">
												{(error && (error as any)?.data?.message) ||
													'No messages found'}
											</AlertTitle>
										</Alert>
									</div>
								)}
							</div>
						</div>
					</div>
					<div ref={messagesEndRef} />
				</div>

				{!error && (
					<>
						<Separator className="mt-auto" />
						<div className="p-4">
							<form ref={formRef} onSubmit={handleSend}>
								<div className="flex md:grid gap-4 relative">
									{personalMessage && (
										<div className="absolute -top-11 left-0 w-full h-auto bg-gray-200 p-1 rounded-md text-xs">
											<p className="font-semibold">
												{personalMessage.sender.name}
											</p>
											<p>{personalMessage.text}</p>
											<button
												className="absolute top-1 right-1"
												onClick={() => setPersonalMessage(null)}
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									)}
									<Input
										ref={inputRef as React.RefObject<HTMLInputElement>}
										value={input}
										onChange={(e) => setInput(e.target.value)}
										name="message"
										onKeyDown={handleKeyDown}
										className="md:hidden md:invisible flex-1"
										placeholder={`Type your message...`}
									/>
									<Textarea
										ref={inputRef as React.RefObject<HTMLTextAreaElement>}
										value={input}
										onChange={(e) => setInput(e.target.value)}
										name="message"
										onKeyDown={handleKeyDown}
										className="hidden invisible md:visible md:block resize-none"
										placeholder={`Type your message...`}
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
