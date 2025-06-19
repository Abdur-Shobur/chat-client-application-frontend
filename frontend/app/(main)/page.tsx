import * as React from 'react';
import Inbox from '../components/inbox';
import { MailDisplay } from '../components/mail-display';
import { mails } from '../data';

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-lg font-semibold text-left">Message Center </h2>
			<p>Here you will find all your messages</p>
		</div>
	);
}
