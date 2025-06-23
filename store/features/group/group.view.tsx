'use client';

import React from 'react';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, MoreVertical } from 'lucide-react';
import { useGroupMyQuery, useGroupsQuery } from './group.api-slice';
import { toast } from '@/hooks/use-toast';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { env } from '@/lib';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function GroupView() {
	const { data, isLoading } = useGroupMyQuery(undefined);
	const { data: session } = useSession();
	const isAdmin = session?.user?.role === 'admin';
	const router = useRouter();
	const handleCopy = (link: string) => {
		navigator.clipboard.writeText(link);
		toast({ title: 'Copied', description: 'Group join link copied' });
	};

	if (isLoading) return <div>Loading...</div>;
	if (!data?.data?.length) return <div>No groups found.</div>;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{data.data.map((group: any) => {
				const joinLink = `${env.next_auth_url}?type=group&join=${group._id}`;

				return (
					<Card key={group._id} className="relative w-full">
						<CardHeader className="pb-2 space-y-2">
							<div className="flex items-start justify-between">
								<Link
									href={`${isAdmin ? '/admin' : '/user'}/inbox/${
										group._id
									}?type=group`}
									className="no-underline"
								>
									<div>
										<CardTitle className="text-lg">{group.name}</CardTitle>
										{group?.description && (
											<CardDescription className="line-clamp-2">
												{group.description}
											</CardDescription>
										)}
									</div>
								</Link>
								{isAdmin && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="w-8 h-8">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => {
													router.push(`/admin/group/${group._id}`);
												}}
											>
												📝 Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													router.push(`/admin/group/${group._id}/members`);
												}}
											>
												👥 View Members
											</DropdownMenuItem>
											{/*<DropdownMenuItem
												onClick={() => console.log('Delete', group._id)}
												className="text-red-500"
											>
												❌ Delete
											</DropdownMenuItem> */}
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>
							<div className="flex gap-2">
								<Input readOnly value={joinLink} className="text-sm" />
								<Button
									size="icon"
									variant="outline"
									onClick={() => handleCopy(joinLink)}
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>

						<CardContent className="flex flex-wrap gap-2 text-sm pt-0">
							<Badge
								variant={group.status === 'active' ? 'default' : 'destructive'}
							>
								{group.status}
							</Badge>
							<Badge variant="secondary">
								Members: {group.members?.length || 0}
							</Badge>
							{group?.pendingMembers?.length > 0 && (
								<Badge variant="secondary">
									Pending: {group?.pendingMembers?.length || 0}
								</Badge>
							)}
							{group.tags?.map((tag: string) => (
								<Badge key={tag} variant="outline">
									#{tag}
								</Badge>
							))}
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
