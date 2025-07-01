'use client';

import Inbox from '@/app/components/inbox';
import GroupJoin from '@/store/features/group/group.join';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
	const params = useParams();
	const isDetailPage = Boolean(params?.id);
	const { data: session } = useSession();

	const isAdmin = session?.user?.role === 'admin';

	return (
		<>
			{/* GroupJoin stays unless in the detail view for non-admin */}
			<GroupJoin />
			{/* If the user is not logged in, redirect to the login page */}
			{!isAdmin ? (
				<div className="max-w-6xl mx-auto shadow rounded relative">
					{children}
				</div>
			) : (
				<div className="grid grid-cols-12 min-h-screen">
					{/* Inbox column - only visible for admin */}

					<div
						className={`col-span-12 lg:col-span-3 border-r ${
							isDetailPage ? 'hidden lg:block' : ''
						}`}
					>
						<Inbox />
					</div>

					<div
						className={`col-span-12 lg:col-span-9 ${
							!isDetailPage ? 'hidden lg:block' : ''
						}`}
					>
						{children}
					</div>
				</div>
			)}
		</>
	);
}
