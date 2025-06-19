'use client';
import * as React from 'react';
import { File, Inbox, Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Nav } from './nav';
import { LogoutButton } from '@/lib/logout';
import { useSession } from 'next-auth/react';

interface UserLayoutProps {
	defaultCollapsed?: boolean;
	children?: React.ReactNode;
}

export function UserLayout({
	defaultCollapsed = false,
	children,
}: UserLayoutProps) {
	const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
	const { data, status } = useSession();
	if (status === 'loading') {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-blue-600" />
			</div>
		);
	}

	if (data?.user.role !== 'user') {
		return;
	}
	return (
		<div className="grid grid-cols-12">
			<div className="col-span-2 border-r h-screen overflow-y-auto">
				<div
					className={cn(
						'flex h-[52px] items-center',
						isCollapsed ? 'h-[52px]' : 'px-2'
					)}
				>
					<h2 className="text-lg font-semibold text-left">Message Center</h2>
				</div>
				<Separator />
				<Nav
					isCollapsed={isCollapsed}
					links={[
						{
							title: 'Inbox',
							label: '128',
							icon: Inbox,
							variant: 'default',
							href: '/',
						},
						{
							title: 'Group',
							label: '9',
							icon: File,
							variant: 'ghost',
							href: '/user/group',
						},
					]}
				/>
				<Separator />
				<Nav
					isCollapsed={isCollapsed}
					links={[
						{
							title: 'Settings',
							label: '972',
							icon: Users2,
							variant: 'ghost',
							href: '/user/settings',
						},
					]}
				/>
				<LogoutButton />
				<Separator />
			</div>
			<div className="col-span-10">{children}</div>
		</div>
	);
}
