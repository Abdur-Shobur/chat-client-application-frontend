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
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Nav } from './nav';
import { type Mail } from '../data';

interface MailProps {
	defaultLayout: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
	children?: React.ReactNode;
}

export function Mail({
	defaultLayout = [20, 32, 48],
	defaultCollapsed = false,
	navCollapsedSize,
	children,
}: MailProps) {
	const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={(sizes: number[]) => {
					document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
						sizes
					)}`;
				}}
				className="h-full max-h-screen items-stretch"
			>
				{/* Nav */}
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={navCollapsedSize}
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
					className={`min-h-screen ${cn(
						isCollapsed &&
							'min-w-[50px] transition-all duration-300 ease-in-out'
					)}`}
				>
					<div
						className={cn(
							'flex h-[52px] items-center',
							isCollapsed ? 'h-[52px]' : 'px-2'
						)}
					>
						<h2 className="text-lg font-semibold text-left  ">
							Message Center
						</h2>
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
								title: 'Drafts',
								label: '9',
								icon: File,
								variant: 'ghost',
							},
							// {
							// 	title: 'Sent',
							// 	label: '',
							// 	icon: Send,
							// 	variant: 'ghost',
							// },
							// {
							// 	title: 'Junk',
							// 	label: '23',
							// 	icon: ArchiveX,
							// 	variant: 'ghost',
							// },
							// {
							// 	title: 'Trash',
							// 	label: '',
							// 	icon: Trash2,
							// 	variant: 'ghost',
							// },
							// {
							// 	title: 'Archive',
							// 	label: '',
							// 	icon: Archive,
							// 	variant: 'ghost',
							// },
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
								href: '/settings',
							},
							// {
							// 	title: 'Updates',
							// 	label: '342',
							// 	icon: AlertCircle,
							// 	variant: 'ghost',
							// },
							// {
							// 	title: 'Forums',
							// 	label: '128',
							// 	icon: MessagesSquare,
							// 	variant: 'ghost',
							// },
							// {
							// 	title: 'Shopping',
							// 	label: '8',
							// 	icon: ShoppingCart,
							// 	variant: 'ghost',
							// },
							// {
							// 	title: 'Promotions',
							// 	label: '21',
							// 	icon: Archive,
							// 	variant: 'ghost',
							// },
						]}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				{children}
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
