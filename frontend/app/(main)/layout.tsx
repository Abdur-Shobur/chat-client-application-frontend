import React from 'react';
import { cookies } from 'next/headers';
import { Mail } from '../components/mail';
export default function Layout({ children }: { children: React.ReactNode }) {
	const layout = cookies().get('react-resizable-panels:layout:mail');
	const collapsed = cookies().get('react-resizable-panels:collapsed');

	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
	return (
		<>
			<div className="flex-col flex">
				<Mail
					defaultLayout={defaultLayout}
					defaultCollapsed={defaultCollapsed}
					navCollapsedSize={4}
					children={children}
				/>
			</div>
		</>
	);
}
