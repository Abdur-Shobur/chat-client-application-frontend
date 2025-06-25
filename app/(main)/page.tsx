import { LogoutButton } from '@/lib/logout';
import * as React from 'react';

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-lg font-semibold text-left">Message Center </h2>
			<p className="mb-4">Here you will find all your messages</p>
			<LogoutButton />
		</div>
	);
}
