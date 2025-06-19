'use client';
import React from 'react';
import { useUsersQuery } from './message.api-slice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function UserList() {
	const { data, isLoading } = useUsersQuery(undefined);

	if (isLoading) return <div>Loading...</div>;
	if (!data?.data) return <div>No users found.</div>;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{data.data.map((user: any) => (
				<Card key={user._id} className="relative">
					<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
						<Link href={`/admin/inbox/${user._id}`}>
							<CardTitle className="text-lg font-semibold">
								{user.name}
							</CardTitle>
						</Link>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => console.log('Edit', user._id)}>
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => console.log('Change Status', user._id)}
								>
									Change Status
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => console.log('Delete', user._id)}
									className="text-red-500"
								>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardHeader>

					<CardContent className="text-sm text-muted-foreground space-y-1">
						<p>
							<span className="font-medium text-foreground">Email:</span>{' '}
							{user.email}
						</p>
						<p>
							<span className="font-medium text-foreground">Phone:</span>{' '}
							{user.phone}
						</p>
						<p>
							<span className="font-medium text-foreground">Role:</span>{' '}
							<Badge variant="outline">{user.role.name}</Badge>
						</p>
						<p>
							<span className="font-medium text-foreground">Status:</span>{' '}
							<Badge
								variant={user.status === 'active' ? 'default' : 'destructive'}
							>
								{user.status}
							</Badge>
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
