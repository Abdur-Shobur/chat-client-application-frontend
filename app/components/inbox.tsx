'use client';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import { useChatQuery } from '@/store/features/message';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { GroupCreate } from '@/store/features/group';
import { Badge } from '@/components/ui/badge';
import { connectSocket } from '@/lib/socketClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { PopcornIcon } from 'lucide-react';
// import { socket } from '@/lib/socketClient';

export default function Inbox() {
	const { data, refetch, isLoading } = useChatQuery(undefined);
	const { data: session } = useSession();
	const isAdmin = session?.user.role === 'admin';
	const isUser = session?.user.role === 'user';
	const params = useParams();
	const [search, setSearch] = useState('');

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
					refetch();
				};

				socket.on('receiveMessage', handleReceiveMessage);

				// Move this cleanup into the outer scope so useEffect can return it
				return () => {
					socket.off('receiveMessage', handleReceiveMessage);
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

	const filteredMessages = data?.data?.filter((item) => {
		const isGroup = item.chatType === 'group';
		const name = isGroup
			? item.groupInfo?.name || ''
			: item.userInfo?.name || '';

		return name.toLowerCase().includes(search.toLowerCase());
	});

	return (
		<Tabs defaultValue="all">
			<div className="flex items-center justify-between gap-5 px-5 py-4">
				<div className="flex items-center gap-2">
					<Link href="/" className="text-xl font-bold capitalize">
						{session?.user.name || 'Inbox'}
					</Link>
					{isAdmin && <GroupCreate />}
				</div>
				{isAdmin && <Badge variant="outline">Admin</Badge>}
				{isUser && <Badge variant="secondary">User</Badge>}
			</div>
			<Separator />
			<div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="relative">
					<Input
						placeholder="Search"
						className="pl-8"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>
			<ScrollArea className="h-[85vh]">
				<div className="flex flex-col gap-2 p-4 pt-0">
					{isLoading && (
						<div className="flex flex-col gap-3">
							{Array.from({ length: 12 }).map((_, index) => (
								<div key={index} className="flex items-center space-x-4">
									<Skeleton className="h-12 w-12 rounded-full" />
									<div className="space-y-2 w-full">
										<Skeleton className="h-4 w-11/12" />
										<Skeleton className="h-4 w-3/4" />
									</div>
								</div>
							))}
						</div>
					)}
					{!isLoading &&
						filteredMessages?.map((item, index) => {
							const isGroup = item.chatType === 'group';
							const name = isGroup
								? item.groupInfo?.name || 'Unknown Group'
								: item.userInfo?.name || 'Unknown User';
							const id = isGroup ? item.groupInfo?._id : item.userInfo?._id;

							return (
								<Link
									href={`/${id}?type=${isGroup ? 'group' : 'personal'}`}
									key={index}
									className={cn(
										`flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent ${
											params.id === id && 'bg-muted'
										}`
									)}
								>
									<div className="flex w-full flex-col gap-1">
										<div className="flex items-center">
											<div className="flex items-center gap-2">
												<div className="font-semibold">{name}</div>
												{/* You can show unread dot here if needed */}
											</div>
											{item?.lastMessage?.createdAt && (
												<div className="ml-auto text-xs text-muted-foreground">
													{formatDistanceToNow(
														new Date(item.lastMessage.createdAt),
														{
															addSuffix: true,
														}
													)}
												</div>
											)}
										</div>
										<div className="text-xs font-medium">
											{item.lastMessage?.text}
										</div>
									</div>
								</Link>
							);
						})}

					{!isLoading && filteredMessages?.length === 0 && (
						<div className="flex flex-col items-center gap-2 p-4 pt-0">
							<Alert className="flex gap-2 align-center ">
								<PopcornIcon className="h-4 w-4 !top-3" />
								<AlertTitle className="mb-0">No messages found</AlertTitle>
							</Alert>
						</div>
					)}
				</div>
			</ScrollArea>
		</Tabs>
	);
}
