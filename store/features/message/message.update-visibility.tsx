'use client';
import React from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Lucide icons
import { useUpdateVisibilityMutation } from './message.api-slice';
import { Button } from '@/components/ui/button';

type UpdateVisibilityProps = {
	id: string;
	visibility: 'public' | 'private'; // Assuming two visibility states
};

export default function UpdateVisibility({
	id,
	visibility,
}: UpdateVisibilityProps) {
	const [updateVisibility, { isLoading }] = useUpdateVisibilityMutation();

	const handleToggle = async () => {
		try {
			await updateVisibility({ chatId: id }).unwrap();
		} catch (error) {
			console.error('Failed to update visibility', error);
		}
	};

	return (
		<Button
			onClick={handleToggle}
			disabled={isLoading}
			aria-label="Toggle visibility"
			variant="ghost"
			size="icon"
			className="h-8 w-8"
		>
			{isLoading ? (
				<Loader2 className="animate-spin text-gray-500" />
			) : visibility === 'private' ? (
				<EyeOff className="text-red-500" />
			) : (
				<Eye className="text-green-500" />
			)}
		</Button>
	);
}
