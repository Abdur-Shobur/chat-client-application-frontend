import Inbox from '@/app/components/inbox';
import { MailDisplay } from '@/app/components/mail-display';
import { mails } from '@/app/data';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-12">
			<div className="col-span-4 border-r">
				<Inbox />
			</div>
			<div className="col-span-8 border-r">{children}</div>
		</div>
	);
}
