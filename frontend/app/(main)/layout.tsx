import React, { Suspense } from 'react';
import { AdminLayout } from '../components/admin-layout';
import { UserLayout } from '../components/user-layout';
import GroupJoin from '@/store/features/group/group.join';
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<div>Loading search params...</div>}>
			<div className="flex-col lg:flex">
				<AdminLayout>{children}</AdminLayout>
				<UserLayout>{children}</UserLayout>
			</div>

			<GroupJoin />
		</Suspense>
	);
}
