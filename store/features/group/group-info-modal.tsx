'use client';
import { useState } from 'react';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Ensure this exists or is styled properly
import GroupSettings from './group.settings';
import GroupMembers from './group.members';

export function GroupInfo({
	userOrGroupInfo,
	groupId,
}: {
	userOrGroupInfo: any;
	groupId: string;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Avatar className="cursor-pointer">
					<AvatarImage alt={userOrGroupInfo?.data.name} />
					<AvatarFallback className="capitalize">
						{userOrGroupInfo?.data.name
							.split(' ')
							.map((chunk: any) => chunk[0])
							.join('')}
					</AvatarFallback>
				</Avatar>
			</DialogTrigger>

			<DialogContent className="max-w-[1000px] h-[90%] block overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-center">Group Details</DialogTitle>
				</DialogHeader>

				{/* Tabs start here */}
				<Tabs defaultValue="members" className="w-full mt-4">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="members">
							Members ({userOrGroupInfo?.data?.members?.length || 0})
						</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>

					<TabsContent value="members">
						<div className="p-4">
							<GroupMembers groupId={groupId} />
						</div>
					</TabsContent>
					<TabsContent value="settings">
						<div className="p-4">
							<GroupSettings groupId={groupId} />
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
