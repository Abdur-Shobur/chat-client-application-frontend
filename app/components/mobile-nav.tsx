'use client';

import { Inbox, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // your classNames utility
import { useSession } from 'next-auth/react';

const MobileNav = () => {
	const pathname = usePathname();
	const { data } = useSession();

	// Hide mobile nav on detail pages
	if (pathname.includes('/inbox/')) {
		return null;
	}

	const adminLinks = [
		{
			href: '/admin/inbox',
			icon: <Inbox className="h-6 w-6" />,
			label: 'Inbox',
		},
		{
			href: '/admin/members',
			icon: <Users className="h-6 w-6" />,
			label: 'Members',
		},
		{
			href: '/admin/group',
			icon: <Users className="h-6 w-6" />,
			label: 'Groups',
		},
		{
			href: '/admin/settings',
			icon: <Settings className="h-6 w-6" />,
			label: 'Settings',
		},
	];
	const userLinks = [
		{
			href: '/user/inbox',
			icon: <Inbox className="h-6 w-6" />,
			label: 'Inbox',
		},
		{
			href: '/user/group',
			icon: <Users className="h-6 w-6" />,
			label: 'Profile',
		},
		{
			href: '/user/settings',
			icon: <Settings className="h-6 w-6" />,
			label: 'Settings',
		},
	];

	const links = data?.user.role === 'admin' ? adminLinks : userLinks;

	return (
		<div className="md:hidden fixed bottom-0 left-0 w-full border-t bg-white z-50">
			<nav className="flex justify-around items-center py-2">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							'flex flex-col items-center p-2',
							pathname === link.href
								? 'text-blue-600'
								: 'text-muted-foreground hover:text-blue-500'
						)}
					>
						{link.icon}
					</Link>
				))}
			</nav>
		</div>
	);
};

export default MobileNav;
