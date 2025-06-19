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
			await createGroup({ ...values, members: selectedMembers }).unwrap();
			form.reset();
			setSelectedMembers([]);
			setStep(1);
		} catch (err) {
			console.error('Failed to create group', err);
		}
	};

	const toggleMember = (id: string) => {
		setSelectedMembers((prev) =>
			prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
		);
	};

	return (
		<Dialog onOpenChange={() => setStep(1)}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<SquarePen className="mr-2 h-4 w-4" />
					<span className="hidden lg:inline">Create Group</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[1000px]">
				<DialogHeader>
					<DialogTitle className="text-center">
						{step === 1 ? 'Create Group' : 'Select Members'}
					</DialogTitle>
				</DialogHeader>

				{step === 1 ? (
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
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea placeholder="Short description..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="joinType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Join Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="public">Public</SelectItem>
													<SelectItem value="private">Private</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="joinApprovalType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Approval Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="auto">Auto</SelectItem>
													<SelectItem value="manual">Manual</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="welcomeMessage"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Welcome Message</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Welcome to the group!"
												{...field}
											/>
										</FormControl>
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
								<Button
									type="button"
									variant="secondary"
									onClick={() => setStep(2)}
								>
									Select Members ({selectedMembers.length})
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? 'Creating...' : 'Create Group'}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				) : (
					<div className="space-y-4">
						<div className="grid gap-2 grid-cols-4">
							<GroupUsers
								selectedMembers={selectedMembers}
								toggleMember={toggleMember}
							/>
						</div>
						<DialogFooter className="flex justify-between pt-4">
							<Button variant="outline" onClick={() => setStep(1)}>
								Back to Form
							</Button>
							<Button variant="default" onClick={() => setStep(1)}>
								Done ({selectedMembers.length} selected)
							</Button>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
