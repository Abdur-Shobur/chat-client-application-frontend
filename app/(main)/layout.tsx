'use client';

import Inbox from '@/app/components/inbox';
import GroupJoin from '@/store/features/group/group.join';
import { useSession } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
	const params = useParams();
	const isDetailPage = params?.id || false;
	const { data: session } = useSession();

	return (
		<div className="grid grid-cols-12 min-h-screen">
			{/* Inbox column - hidden on mobile if viewing detail page */}
			{/* {session?.user?.role === 'admin' && (
				<div
					className={`col-span-12 lg:col-span-3 border-r ${
						isDetailPage ? 'hidden lg:block' : ''
					}`}
				>
					<Inbox />
				</div>
			)} */}
			<div
				className={`col-span-12 lg:col-span-3 border-r ${
					isDetailPage ? 'hidden lg:block' : ''
				}`}
			>
				<Inbox />
			</div>
			<GroupJoin />
			{/* Children (message view) - hidden on mobile if not viewing detail page */}
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
