import * as React from 'react';
import { ResizablePanel } from '@/components/ui/resizable';
import { cookies } from 'next/headers';
import { Separator } from '@/components/ui/separator';
import { GroupCreate, GroupView } from '@/store/features/group';

export default function Page() {
	const layout = cookies().get('react-resizable-panels:layout:mail');
	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

	return (
		<>
			{/* Inbox */}
			<ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
				<div className="overflow-y-auto h-screen ">
					<div className="flex items-center px-4 py-2.5 gap-2">
						<h1 className="text-xl font-bold">Members</h1>
						<GroupCreate />
					</div>
					<Separator />
					<div className="p-2">
						<GroupView />
					</div>
				</div>
			</ResizablePanel>
		</>
	);
}
