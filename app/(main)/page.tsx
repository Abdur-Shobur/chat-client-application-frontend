'use client';
import { LogoutButton } from '@/lib/logout';
import { useSession } from 'next-auth/react';
import * as React from 'react';

export default function Page() {
	const { status } = useSession();

	if (status === 'loading') {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-blue-600" />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-lg font-semibold text-left">Message Center </h2>
			<p className="mb-4">Here you will find all your messages</p>
			<LogoutButton />
		</div>
	);
}
