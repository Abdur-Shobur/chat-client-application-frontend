import { AuthLoginTab } from '@/store/features/auth/auth.login';
import React, { Suspense } from 'react';

export default function page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex justify-center items-center h-screen">
				<AuthLoginTab />
			</div>
		</Suspense>
	);
}
