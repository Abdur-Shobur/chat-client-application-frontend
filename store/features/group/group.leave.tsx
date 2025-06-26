'use client';
import React from 'react';
import { useGroupLeaveMutation } from './group.api-slice';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export default function GroupLeave({ id }: { id: string }) {
	const router = useRouter();
	const [groupLeave, { isLoading }] = useGroupLeaveMutation();
	const handleLeave = async () => {
		try {
			await groupLeave({ id }).unwrap();
			router.push('/');
			toast({
				title: 'Success',
				description: 'Leaved group successfully',
			});
		} catch (err) {
			console.error('Failed to leave group:', err);
		}
	};
	return (
		<div className="absolute top-4 right-2">
			<Badge variant={'destructive'} onClick={handleLeave}>
				Leave{' '}
				{isLoading && (
					<span className="loading loading-spinner loading-xs"></span>
				)}
			</Badge>
		</div>
	);
}
