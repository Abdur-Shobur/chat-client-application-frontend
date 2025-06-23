'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
	useGroupCreateMutation,
	useGroupUpdateMutation,
} from './group.api-slice';
import GroupUsers from './group.users';

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

export function GroupUpdate({ defaultValues }: { defaultValues: any }) {
	const [mute, { isLoading }] = useGroupUpdateMutation();
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
	useEffect(() => {
		if (defaultValues) {
			form.setValue('name', defaultValues.name);
			form.setValue('description', defaultValues.description);
			form.setValue('joinType', defaultValues.joinType);
			form.setValue('joinApprovalType', defaultValues.joinApprovalType);
			form.setValue('welcomeMessage', defaultValues.welcomeMessage);
			form.setValue('status', defaultValues.status);
			setSelectedMembers(defaultValues.members);
		}
	}, [defaultValues]);

	const onSubmit = async (values: GroupSchema) => {
		try {
			await mute({
				...values,
				members: selectedMembers,
				id: defaultValues._id,
			}).unwrap();
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
		<div>
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
										<Select onValueChange={field.onChange} value={field.value}>
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
										<Select onValueChange={field.onChange} value={field.value}>
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
										<Textarea placeholder="Welcome to the group!" {...field} />
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
								{isLoading ? 'Updating...' : 'Update Group'}
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
		</div>
	);
}
