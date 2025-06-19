'use client';
import * as React from 'react';
import { File, Inbox, Users2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Nav } from './nav';
import { LogoutButton } from '@/lib/logout';
import { useSession } from 'next-auth/react';

interface AdminLayoutProps {
	defaultCollapsed?: boolean;
	children?: React.ReactNode;
}

export function AdminLayout({
	defaultCollapsed = false,
	children,
}: AdminLayoutProps) {
	const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
	const { data } = useSession();

	if (data?.user.role !== 'admin') {
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
							href: '/admin/inbox',
						},
						{
							title: 'Group',
							label: '9',
							icon: File,
							variant: 'ghost',
							href: '/admin/group',
						},
						{
							title: 'Members',
							label: '9',
							icon: File,
							variant: 'ghost',
							href: '/admin/members',
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
							href: '/admin/settings',
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
