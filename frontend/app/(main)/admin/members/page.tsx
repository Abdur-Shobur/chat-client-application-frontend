import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { GroupCreate, GroupView } from '@/store/features/group';
import UserList from '@/store/features/user/user.list';
import { CreateUser } from '@/store/features/user';

export default function Page() {
	return (
		<>
			{/* Inbox */}
			<div className="overflow-y-auto h-screen ">
				<div className="flex items-center px-4 py-2.5 gap-2">
					<h1 className="text-xl font-bold">Members</h1>
					{/* <CreateUser /> */}
				</div>
				<Separator />
				<div className="p-2">
					<UserList />
				</div>
			</div>
		</>
	);
}
