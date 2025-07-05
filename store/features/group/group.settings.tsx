'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { env } from '@/lib';
import GroupDelete from './group.delete';

export default function GroupSettings({ groupId }: { groupId: string }) {
	const joinLink = `${env.next_auth_url}?type=group&join=${groupId}`;
	const handleCopy = (link: string) => {
		navigator.clipboard.writeText(link);
		toast({ title: 'Copied', description: 'Group join link copied' });
	};
	return (
		<div className="space-y-4">
			<div className="p-4 border rounded">
				<h4 className="text-lg">Group Join Link</h4>
				<div className="flex gap-2">
					<Input readOnly value={joinLink} className="text-sm" />
					<Button
						size="icon"
						variant="outline"
						onClick={() => handleCopy(joinLink)}
					>
						<Copy className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="p-4 border rounded">
				<h4 className="text-lg">Group Delete</h4>
				<p className="text-xs text-red-500">
					If you delete this group, all messages will be deleted
				</p>
				<div className="flex gap-2 mt-2">
					<GroupDelete id={groupId} />
				</div>
			</div>
		</div>
	);
}
