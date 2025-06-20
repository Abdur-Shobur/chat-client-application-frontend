'use client';

import Inbox from '@/app/components/inbox';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { data: session } = useSession();
	const isDetailPage = pathname !== `/${session?.user.role}/inbox`;

	return (
		<div className="grid grid-cols-12 min-h-screen">
			{/* Inbox column - hidden on mobile if viewing detail page */}
			<div
				className={`col-span-12 lg:col-span-4 border-r ${
					isDetailPage ? 'hidden lg:block' : ''
				}`}
			>
				<Inbox />
			</div>

			{/* Children (message view) - hidden on mobile if not viewing detail page */}
			<div
				className={`col-span-12 lg:col-span-8 ${
					!isDetailPage ? 'hidden lg:block' : ''
				}`}
			>
				{children}
			</div>
		</div>
	);
}
