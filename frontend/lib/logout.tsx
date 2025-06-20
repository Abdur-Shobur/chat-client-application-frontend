import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const LogoutButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
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
				variant="link"
				className="no-underline"
			>
				<LogOut className="h-4 w-4" />
				{!isCollapsed && <span>Log out</span>}
			</Button>
		</div>
	);
};
