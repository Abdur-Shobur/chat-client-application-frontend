'use client';
import { useGetMemberDetailsQuery } from '@/store/features/group/group.api-slice';
import MemberRemove from '@/store/features/group/member.remove';
import React from 'react';

export default function Page({ params }: { params: { id: string } }) {
	console.log(params, 'groupId');

	const { data, isLoading } = useGetMemberDetailsQuery({ id: params.id });

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!data?.data) {
		return <div>Group not found</div>;
	}

	const group = data.data;

	return (
		<div className="p-4">
			{/* Group Info */}
			<div className="mb-6">
				<div className="flex items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold">{group.name}</h1>
						<p className="text-gray-600">{group.description}</p>
						<p className="text-sm text-gray-500">
							Created At: {new Date(group.createdAt).toLocaleDateString()}
						</p>
					</div>
				</div>
				<div className="mt-4">
					<p>
						<strong>Join Type:</strong> {group.joinType}
					</p>
					<p>
						<strong>Approval Type:</strong> {group.joinApprovalType}
					</p>
					<p>
						<strong>Welcome Message:</strong> {group.welcomeMessage}
					</p>
				</div>
			</div>

			{/* Members List */}
			<div>
				<h2 className="text-xl font-semibold mb-4">
					Group Members ({group?.members?.length})
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{group?.members?.map((member: any) => (
						<div
							key={member._id}
							className="border p-4 rounded shadow-sm bg-white"
						>
							<h3 className="text-lg font-medium">{member.name}</h3>
							<p className="text-sm text-gray-700">Email: {member.email}</p>
							<p className="text-sm text-gray-700">Phone: {member.phone}</p>
							<p className="text-sm text-gray-500">Status: {member.status}</p>
							{group?._id && (
								<MemberRemove groupId={group?._id} userId={member?._id} />
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
