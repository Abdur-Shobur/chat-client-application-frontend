'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGroupByIdQuery, useGroupJoinMutation } from './group.api-slice';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';

export default function GroupJoin() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const groupId = searchParams.get('join');
	const type = searchParams.get('type');
	const { data: session } = useSession();
	const isAdmin = session?.user?.role === 'admin';
	const [open, setOpen] = useState(false);
	const [joined, setJoined] = useState(false);

	const { data: groupData, isLoading } = useGroupByIdQuery(
		{ id: groupId || '' },
		{ skip: !groupId || type !== 'group' }
	);

	const [joinGroup, { isLoading: joining }] = useGroupJoinMutation();

	useEffect(() => {
		if (type === 'group' && groupId) {
			setOpen(true); // Modal opens manually when URL contains join param
		}
	}, [type, groupId]);

	// Redirect to home if modal closes
	const handleClose = () => {
		setOpen(false);
		router.push(`/`);
	};

	const handleJoin = async () => {
		try {
			const { data } = await joinGroup({ groupId: groupId! }).unwrap();
			if (data.message === 'Successfully joined the group.') {
				toast({
					title: 'Success',
					description: 'Joined group successfully',
				});
				setOpen(false);
				router.push(`/` + groupId + '?type=group');
			}
		} catch (err: any) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					err?.data?.message || 'Failed to join group. Please try again later.',
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="flex items-center justify-between">
					<DialogTitle>
						{isLoading
							? 'Loading group...'
							: groupData?.data?.name || 'Group Join'}
					</DialogTitle>
					{/* Custom close icon */}
					{/* <Button
						variant="ghost"
						size="icon"
						className="ml-auto"
						onClick={handleClose}
					>
						<X className="w-4 h-4" />
					</Button> */}
				</DialogHeader>

				<div className="mt-4 space-y-4">
					<p>Do you want to join this group?</p>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button onClick={handleJoin} disabled={joining}>
							{joining ? 'Joining...' : 'Join'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
