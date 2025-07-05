'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { confirm } from '@/lib/confirm';
import React from 'react';
import { useGroupDeleteMutation } from './group.api-slice';
import { useRouter } from 'next/navigation';

export default function GroupDelete({ id }: { id: string }) {
	const router = useRouter();
	const [deleting, { isLoading }] = useGroupDeleteMutation();
	const handleDelete = async (id: string) => {
		const confirmed = await confirm({
			message: 'This will delete the message. Are you sure?',
			CustomComponent: (
				<div className="mb-4">
					<h2 className="text-lg font-semibold text-gray-900">Delete Group</h2>
					<p className="mt-1 text-sm text-gray-600">
						Are you sure you want to delete this group? This action cannot be
						undone.
					</p>
				</div>
			),
		});

		if (!confirmed) return;

		try {
			// await handleDeleteMessage(id);
			await deleting({ groupId: id }).unwrap();
			router.push('/');

			toast({
				title: 'Success',
				description: 'Group deleted successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete group',
				variant: 'destructive',
			});
		}
	};

	return (
		<Button
			type="button"
			variant="destructive"
			disabled={isLoading}
			onClick={() => handleDelete(id)}
		>
			Group Delete
		</Button>
	);
}
