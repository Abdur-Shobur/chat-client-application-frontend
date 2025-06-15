import * as React from 'react';
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';
import { cookies } from 'next/headers';
import Inbox from '../components/inbox';
import { MailDisplay } from '../components/mail-display';
import { mails } from '../data';
interface MailProps {
	defaultLayout: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
}
export default function Page() {
	const layout = cookies().get('react-resizable-panels:layout:mail');
	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

	return (
		<>
			{/* Inbox */}
			<ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
				<Inbox />
			</ResizablePanel>
			<ResizableHandle withHandle />
			{/* Mail Display */}
			<ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
				<MailDisplay mail={mails[0]} />
			</ResizablePanel>
		</>
	);
}
