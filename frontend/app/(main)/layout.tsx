import React from 'react';
import { AdminLayout } from '../components/admin-layout';
import { UserLayout } from '../components/user-layout';
import GroupJoin from '@/store/features/group/group.join';
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{/* <div className="flex-col flex lg:hidden h-screen items-center justify-center">
				<div className="text-center">
					<p className="text-lg">
						Mobile view not supported yet please use a larger screen
					</p>
					<p className="text-sm text-red-400">We are working on it</p>
				</div>
			</div> */}
			<div className="flex-col lg:flex">
				<AdminLayout>{children}</AdminLayout>
				<UserLayout>{children}</UserLayout>
			</div>

			<GroupJoin />
		</>
	);
}
