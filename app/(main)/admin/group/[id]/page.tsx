'use client';
import { Separator } from '@/components/ui/separator';
import { useGroupByIdQuery } from '@/store/features/group/group.api-slice';
import { GroupUpdate } from '@/store/features/group/group.update';
import { useUserQuery } from '@/store/features/user';
import React from 'react';

export default function Page({ params }: { params: { id: string } }) {
	const { data, isLoading } = useGroupByIdQuery({ id: params.id });

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!data?.data) {
		return <div>Group not found</div>;
	}
	return (
		<div>
			{/* Inbox */}
			<div className="overflow-y-auto h-screen ">
				<div className="flex items-center px-4 py-3 gap-2">
					<h1 className="text-xl font-bold">Update Group</h1>
				</div>
				<Separator />
				<div className="p-4">
					<div className="p-4 max-w-md shadow-md">
						<GroupUpdate defaultValues={data?.data} />
					</div>
				</div>
			</div>
		</div>
	);
}
