'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { SquarePen } from 'lucide-react';
import { useGroupCreateMutation } from './group.api-slice';
import GroupUsers from './group.users';
import { toast } from '@/hooks/use-toast';

// fake users for member select simulation
const mockUsers = [{ id: '67b2c9fc32c98e2ba9cce8d2', name: 'John Doe' }];

const groupSchema = z.object({
	name: z.string().min(1, 'Group name is required'),
	description: z.string().optional(),
	joinType: z.enum(['public', 'private']),
	joinApprovalType: z.enum(['auto', 'manual']),
	welcomeMessage: z.string().optional(),
	status: z.enum(['active', 'inactive']),
	members: z.array(z.string()).optional(),
});

type GroupSchema = z.infer<typeof groupSchema>;

export function GroupCreate() {
	const [createGroup, { isLoading }] = useGroupCreateMutation();
	const [step, setStep] = useState<1 | 2>(1); // Step 1: Group Info, Step 2: Select Members
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const [open, setOpen] = useState(false);

	const form = useForm<GroupSchema>({
		resolver: zodResolver(groupSchema),
		defaultValues: {
			name: '',
			description: '',
			joinType: 'public',
			joinApprovalType: 'auto',
			welcomeMessage: '',
			status: 'active',
			members: [],
		},
	});

	const onSubmit = async (values: GroupSchema) => {
		try {
			const response = await createGroup({
				...values,
				members: selectedMembers,
			}).unwrap();

			toast({
				title: 'Successfully!',
				description: `Group created successfully`,
			});
			form.reset();
			setOpen(false);
		} catch (err: any) {
			toast({
				title: 'Error',
				description: `Failed to create group`,
				variant: 'destructive',
			});

			// Assuming the error has the structure:
			// [{ field: "name", message: "The value \"asdfasdf\" already exists." }]
			if (err?.data?.errors && Array.isArray(err.data.errors)) {
				err.data.errors.forEach((e: { field: string; message: string }) => {
					form.setError(e.field as keyof GroupSchema, {
						type: 'manual',
						message: e.message,
					});
				});
			}
		}
	};

	const toggleMember = (id: string) => {
		setSelectedMembers((prev) =>
			prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="px-2" size="sm" type="button">
					<SquarePen className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-center">Create Group</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Group Name</FormLabel>
									<FormControl>
										<Input placeholder="Group Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="inactive">Inactive</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<DialogFooter className="flex justify-between pt-4">
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Creating...' : 'Create Group'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
