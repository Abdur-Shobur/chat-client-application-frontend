'use client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
	const router = useRouter();

	const handleLogout = () => {
		signOut({ redirect: false }).then(() => {
			router.push('/auth');
		});
	};

	return (
		<div className="ms-2">
			<Button
				onClick={handleLogout}
				size="sm"
				variant="destructive"
				className="no-underline"
			>
				<LogOut className="h-4 w-4" />
				Log out
			</Button>
		</div>
	);
};
