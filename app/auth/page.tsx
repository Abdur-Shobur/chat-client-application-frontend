import { AuthTab } from '@/store/features/auth';
import React, { Suspense } from 'react';

export default function page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex justify-center items-center h-screen">
				<AuthTab />
			</div>
		</Suspense>
	);
}
