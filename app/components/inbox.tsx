'use client';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs } from '@/components/ui/tabs';
import React, { useState } from 'react';
import { useChatQuery } from '@/store/features/message';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
// import { socket } from '@/lib/socketClient';

export default function Inbox() {
	const { data } = useChatQuery(undefined);
	const { data: session } = useSession();
	const isAdmin = session?.user.role === 'admin';
	const params = useParams();
	const [search, setSearch] = useState('');

	// useEffect(() => {
	// 	socket.on('receiveMessage', (message) => {
	// 		console.log('New message:', message);
	// 		// Optionally trigger state update or refetch
	// 	});

	// 	return () => {
	// 		socket.off('receiveMessage');
	// 	};
	// }, []);
	const filteredMessages = data?.data?.filter((item) => {
		const isGroup = item.chatType === 'group';
		const name = isGroup
			? item.groupInfo?.name || ''
			: item.userInfo?.name || '';

		return name.toLowerCase().includes(search.toLowerCase());
	});

	return (
		<Tabs defaultValue="all">
			<div className="flex items-center px-4 py-2">
				<h1 className="text-xl font-bold">Inbox</h1>
				{/* <TabsList className="ml-auto">
					<TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
						All Message
					</TabsTrigger>
					<TabsTrigger
						value="unread"
						className="text-zinc-600 dark:text-zinc-200"
					>
						Unread
					</TabsTrigger>
				</TabsList> */}
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
					{filteredMessages?.map((item) => {
						const isGroup = item.chatType === 'group';
						const name = isGroup
							? item.groupInfo?.name || 'Unknown Group'
							: item.userInfo?.name || 'Unknown User';
						const id = isGroup ? item.groupInfo?._id : item.userInfo?._id;

						return (
							<Link
								href={`/${isAdmin ? 'admin' : 'user'}/inbox/${id}?type=${
									isGroup ? 'group' : 'personal'
								}`}
								key={id}
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
				</div>
			</ScrollArea>
			{/* <TabsContent value="all" className="m-0">
				<MailList items={mails} />
			</TabsContent> */}
			{/* <TabsContent value="unread" className="m-0">
				<MailList items={mails.filter((item) => !item.read)} />
			</TabsContent> */}
		</Tabs>
	);
}
