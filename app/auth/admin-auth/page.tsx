import { AdminAuthLoginTab } from '@/store/features/auth/admin.login';
import React, { Suspense } from 'react';

export default function page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex justify-center items-center h-screen">
				<AdminAuthLoginTab />
			</div>
		</Suspense>
	);
}
