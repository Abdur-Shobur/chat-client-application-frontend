import { AuthTab } from '@/store/features/auth';
import React from 'react';

export default function page() {
	return (
		<div className="flex justify-center items-center h-screen">
			<AuthTab />
		</div>
	);
}
