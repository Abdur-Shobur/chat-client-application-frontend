'use client';
import { Separator } from '@/components/ui/separator';
import { useUserQuery } from '@/store/features/user';
import { EditUser } from '@/store/features/user/user.update';
import React from 'react';

export default function Page({ params }: { params: { id: string } }) {
	const { data, isLoading } = useUserQuery({ id: params.id });

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!data?.data) {
		return <div>User not found</div>;
	}
	return (
		<div>
			{/* Inbox */}
			<div className="overflow-y-auto h-screen ">
				<div className="flex items-center px-4 py-3 gap-2">
					<h1 className="text-xl font-bold">Update User</h1>
					{/* <CreateUser /> */}
				</div>
				<Separator />
				<div className="p-4">
					<div className="p-4 max-w-md shadow-md">
						<EditUser defaultValues={data?.data} />
					</div>
				</div>
			</div>
		</div>
	);
}
