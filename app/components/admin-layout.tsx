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
			<MobileNav />

			{/* Main Content */}
			<div className="flex-1 overflow-y-auto">{children}</div>
		</div>
	);
}
