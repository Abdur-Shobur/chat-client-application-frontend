'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, File, Inbox, Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Nav } from './nav';
import { LogoutButton } from '@/lib/logout';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import MobileNav from './mobile-nav';

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
		return null;
	}

	return (
		<div className="flex h-screen overflow-hidden relative">
			{/* Sidebar */}
			<div
				className={cn(
					'hidden md:flex border-r bg-white h-full transition-all duration-300   flex-col',
					isCollapsed ? 'w-16' : 'w-64'
				)}
			>
				{/* Header with Collapse Toggle */}
				<div className="flex items-center justify-between px-2 py-3  ">
					<h2 className={cn('text-lg font-semibold', isCollapsed && 'hidden')}>
						Message Center
					</h2>
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="p-1 rounded hover:bg-gray-100"
					>
						{isCollapsed ? (
							<ChevronRight size={20} />
						) : (
							<ChevronLeft size={20} />
						)}
					</button>
				</div>

				<Separator />

				{/* Navigation */}
				<Nav
					isCollapsed={isCollapsed}
					links={[
						{
							title: 'Inbox',
							label: '128',
							icon: Inbox,
							variant: 'default',
							href: '/user/inbox',
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

				<LogoutButton isCollapsed={isCollapsed} />

				<Separator />
			</div>

			<MobileNav />
			{/* Main content area */}
			<div className="flex-1 overflow-y-auto">{children}</div>
		</div>
	);
}
