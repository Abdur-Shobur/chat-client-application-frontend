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
		<div className="ms-5 mb-2">
			<button
				type="button"
				onClick={handleLogout}
				className="dark:bg-muted text-xs dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white flex gap-4"
			>
				<LogOut className="h-4 w-4" />
				<span>Log out</span>
			</button>
		</div>
	);
};
