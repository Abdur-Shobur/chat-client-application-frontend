import * as React from 'react';
import { Separator } from '@/components/ui/separator';

export default function Page() {
	return (
		<>
			{/* Inbox */}
			<div className="overflow-y-auto h-screen ">
				<div className="flex items-center px-4 py-3 gap-2">
					<h1 className="text-xl font-bold">Settings</h1>
				</div>
				<Separator />
				<div className="p-2">settings</div>
			</div>
		</>
	);
}
