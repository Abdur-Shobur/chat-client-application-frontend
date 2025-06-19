import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { GroupCreate, GroupView } from '@/store/features/group';

export default function Page() {
	return (
		<>
			{/* Inbox */}
			<div className="overflow-y-auto h-screen ">
				<div className="flex items-center px-4 py-2.5 gap-2">
					<h1 className="text-xl font-bold">Group</h1>
					<GroupCreate />
				</div>
				<Separator />
				<div className="p-2">
					<GroupView />
				</div>
			</div>
		</>
	);
}
