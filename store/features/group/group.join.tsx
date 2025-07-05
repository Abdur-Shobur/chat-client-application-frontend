'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGroupByIdQuery, useGroupJoinMutation } from './group.api-slice';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function GroupJoin() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const groupId = searchParams.get('join');
	const type = searchParams.get('type');
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);

	const { data: groupData, isLoading } = useGroupByIdQuery(
		{ id: groupId || '' },
		{ skip: !groupId || type !== 'group' }
	);

	const [joinGroup, { isLoading: joining }] = useGroupJoinMutation();

	// Check if user is already a member
	const isAlreadyMember = groupData?.data?.members?.some(
		(member: any) => member._id === session?.user?.id
	);

	useEffect(() => {
		if (type === 'group' && groupId && session?.user?.id) {
			// If data is loaded and user is already a member, redirect directly
			if (groupData && isAlreadyMember) {
				router.push(`/${groupId}?type=group`);
				return;
			}
			// If data is loaded and user is not a member, show modal
			if (groupData && !isAlreadyMember) {
				setOpen(true);
			}
		}
	}, [type, groupId, session?.user?.id, groupData, isAlreadyMember, router]);

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
				router.push(`/${groupId}?type=group`);
			}
		} catch (err: any) {
			if (err.data?.message === 'You are already a member of this group.') {
				setOpen(false);
				router.push(`/${groupId}?type=group`);
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description:
						err?.data?.message ||
						'Failed to join group. Please try again later.',
				});
			}
		}
	};

	// Don't render the dialog if user is already a member
	if (isAlreadyMember) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				{isLoading ? (
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-12 w-12 rounded-full" />
							<div className="space-y-2 w-full">
								<Skeleton className="h-4 w-11/12" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Skeleton className="h-12 w-12 rounded-full" />
							<div className="space-y-2 w-full">
								<Skeleton className="h-4 w-11/12" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
					</div>
				) : (
					<>
						<DialogHeader className="flex items-center justify-between">
							<DialogTitle>{groupData?.data?.name}</DialogTitle>
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
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
