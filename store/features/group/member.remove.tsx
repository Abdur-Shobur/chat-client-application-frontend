'use client';
import React from 'react';
import { useMemberRemoveMutation } from './group.api-slice';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function MemberRemove({
	groupId,
	userId,
}: {
	groupId: string;
	userId: string;
}) {
	const [removeMember, { isLoading, isSuccess, isError, error }] =
		useMemberRemoveMutation();

	const handleRemove = async () => {
		try {
			await removeMember({ groupId, userId }).unwrap();

			toast({
				title: 'Success',
				description: 'Removed member successfully',
			});
		} catch (err) {
			toast({
				title: 'Failed',
				description: 'Removed member Failed',
			});
			console.error('Failed to remove member:', err);
		}
	};

	return (
		<div>
			<Button
				variant={'destructive'}
				size="sm"
				onClick={handleRemove}
				disabled={isLoading}
			>
				{isLoading ? 'Removing...' : 'Remove'}
			</Button>
		</div>
	);
}
