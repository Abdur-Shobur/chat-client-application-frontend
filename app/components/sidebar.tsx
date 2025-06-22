'use client';
import * as React from 'react';
import {
	AlertCircle,
	Archive,
	ArchiveX,
	File,
	Inbox,
	MessagesSquare,
	Send,
	ShoppingCart,
	Trash2,
	Users2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { AccountSwitcher } from './account-switcher';
import { Nav } from './nav';
import { accounts } from '../data';

export default function Sidebar({
	defaultCollapsed,
	defaultLayout,
}: {
	defaultLayout: any;
	defaultCollapsed?: any;
}) {
	const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
	return (
		<ResizablePanel
			defaultSize={defaultLayout[0]}
			collapsedSize={4}
			collapsible={true}
			minSize={15}
			maxSize={20}
			onCollapse={() => {
				setIsCollapsed(true);
				document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
					true
				)}`;
			}}
			onResize={() => {
				setIsCollapsed(false);
				document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
					false
				)}`;
			}}
			className={cn(
				isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out'
			)}
		>
			<div
				className={cn(
					'flex h-[52px] items-center justify-center',
					isCollapsed ? 'h-[52px]' : 'px-2'
				)}
			>
				<AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
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
					},
					{
						title: 'Drafts',
						label: '9',
						icon: File,
						variant: 'ghost',
					},
					{
						title: 'Sent',
						label: '',
						icon: Send,
						variant: 'ghost',
					},
					{
						title: 'Junk',
						label: '23',
						icon: ArchiveX,
						variant: 'ghost',
					},
					{
						title: 'Trash',
						label: '',
						icon: Trash2,
						variant: 'ghost',
					},
					{
						title: 'Archive',
						label: '',
						icon: Archive,
						variant: 'ghost',
					},
				]}
			/>
			<Separator />
			<Nav
				isCollapsed={isCollapsed}
				links={[
					{
						title: 'Social',
						label: '972',
						icon: Users2,
						variant: 'ghost',
					},
					{
						title: 'Updates',
						label: '342',
						icon: AlertCircle,
						variant: 'ghost',
					},
					{
						title: 'Forums',
						label: '128',
						icon: MessagesSquare,
						variant: 'ghost',
					},
					{
						title: 'Shopping',
						label: '8',
						icon: ShoppingCart,
						variant: 'ghost',
					},
					{
						title: 'Promotions',
						label: '21',
						icon: Archive,
						variant: 'ghost',
					},
				]}
			/>
		</ResizablePanel>
	);
}
