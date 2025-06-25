'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, File, Inbox, Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Nav } from './nav';
import { LogoutButton } from '@/lib/logout';
import { useSession } from 'next-auth/react';
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
			<MobileNav />
			{/* Main content area */}
			<div className="flex-1 overflow-y-auto">{children}</div>
		</div>
	);
}
