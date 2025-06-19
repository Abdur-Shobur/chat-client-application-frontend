'use client';
import React from 'react';
import { useUsersQuery } from '../user';

export default function GroupUsers({ selectedMembers, toggleMember }) {
	const { data, isLoading } = useUsersQuery(undefined);
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!data || !data.data) {
		return <div>No users found</div>;
	}
	return (
		<>
			{data?.data?.map((user) => (
				<div
					key={user._id}
					className={`flex items-center justify-between px-4 py-1 rounded border cursor-pointer ${
						selectedMembers.includes(user._id)
							? 'bg-primary/10 border-primary'
							: 'hover:bg-muted'
					}`}
					onClick={() => toggleMember(user._id)}
				>
					<span className="text-sm">{user.name}</span>
				</div>
			))}
		</>
	);
}
