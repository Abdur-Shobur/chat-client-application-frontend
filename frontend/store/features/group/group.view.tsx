import React from 'react';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

export function GroupView() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Group Name</CardTitle>
					<CardDescription>This is your public display name.</CardDescription>
					<div className="flex gap-2">
						<Input
							id="link"
							defaultValue="https://ui.shadcn.com/docs/installation"
							readOnly
						/>
						<Button size="icon" className="w-10" variant="outline">
							<Copy />
						</Button>
					</div>
				</CardHeader>
			</Card>
		</div>
	);
}
