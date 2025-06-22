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

interface AdminLayoutProps {
	children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	const [isCollapsed, setIsCollapsed] = React.useState(false);
	const { data } = useSession();

	if (data?.user.role !== 'admin') {
		return null;
	}

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Sidebar */}
			<div
				className={cn(
					'hidden md:flex border-r bg-white h-full transition-all duration-300  flex-col',
					isCollapsed ? 'w-16' : 'w-64'
				)}
			>
				{/* Header with Collapse Toggle */}
				<div
					className={`flex items-center px-2 py-3 ${
						isCollapsed ? 'justify-center' : 'justify-between'
					}`}
				>
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

				<LogoutButton isCollapsed={isCollapsed} />

				<Separator />
			</div>
			<MobileNav />

			{/* Main Content */}
			<div className="flex-1 overflow-y-auto">{children}</div>
		</div>
	);
}
