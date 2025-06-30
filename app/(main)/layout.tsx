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

	// If user is not admin and it's a detail page, just return children only
	if (!isAdmin && isDetailPage) {
		return <>{children}</>;
	}

	return (
		<div className="grid grid-cols-12 min-h-screen">
			{/* Inbox column - only visible for admin */}
			{isAdmin && (
				<div
					className={`col-span-12 lg:col-span-3 border-r ${
						isDetailPage ? 'hidden lg:block' : ''
					}`}
				>
					<Inbox />
				</div>
			)}

			{/* GroupJoin stays unless in the detail view for non-admin */}
			<GroupJoin />

			<div
				className={`col-span-12 lg:col-span-9 ${
					!isDetailPage ? 'hidden lg:block' : ''
				}`}
			>
				{children}
			</div>
		</div>
	);
}
