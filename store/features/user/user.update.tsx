'use client';
// /components/EditUserModal.tsx
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useUpdateUserMutation } from './user.api-slice';

const editUserSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email'),
	phone: z.string().min(7, 'Invalid phone'),
	status: z.enum(['active', 'inactive', 'deleted']),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

export function EditUser({ defaultValues }: { defaultValues: any }) {
	const router = useRouter();
	const [mute, { isLoading }] = useUpdateUserMutation();
	const form = useForm<EditUserFormValues>({
		resolver: zodResolver(editUserSchema),
		defaultValues,
	});

	useEffect(() => {
		if (defaultValues) {
			form.setValue('name', defaultValues.name);
			form.setValue('email', defaultValues.email);
			form.setValue('phone', defaultValues.phone);
			form.setValue('status', defaultValues.status);
		}
	}, [defaultValues]);

	const onSubmit = async (formData: any) => {
		formData.preventDefault();
		const formData2 = form.getValues();
		try {
			await mute({
				id: defaultValues._id,
				name: formData2.name,
				email: formData2.email,
				phone: formData2.phone,
				status: formData2.status,
			}).unwrap();

			toast({
				title: 'Success',
				description: 'User updated successfully',
			});

			form.reset();
		} catch (error: any) {
			if (Array.isArray(error?.data)) {
				error.data.forEach(
					(err: { field: keyof EditUserFormValues; message: string }) => {
						form.setError(err.field, {
							type: 'server',
							message: err.message,
						});
					}
				);
			} else {
				toast({
					title: 'Error',
					description: 'Failed to update user',
				});
			}
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			{/* Name */}
			<div>
				<label className="block text-sm font-medium">Name</label>
				<Input {...form.register('name')} />
				{form.formState.errors.name && (
					<p className="text-red-600 text-sm">
						{form.formState.errors.name.message}
					</p>
				)}
			</div>

			{/* Email */}
			<div>
				<label className="block text-sm font-medium">Email</label>
				<Input {...form.register('email')} />
				{form.formState.errors.email && (
					<p className="text-red-600 text-sm">
						{form.formState.errors.email.message}
					</p>
				)}
			</div>

			{/* Phone */}
			<div>
				<label className="block text-sm font-medium">Phone</label>
				<Input {...form.register('phone')} />
				{form.formState.errors.phone && (
					<p className="text-red-600 text-sm">
						{form.formState.errors.phone.message}
					</p>
				)}
			</div>

			{/* Status */}
			<div>
				<label className="block text-sm font-medium">Status</label>
				<Select {...form.register('status')}>
					<SelectTrigger className="w-full">
						{form.getValues('status')}
					</SelectTrigger>
					<SelectContent>
						{['active', 'inactive', 'deleted'].map((s) => (
							<SelectItem key={s} value={s}>
								{s.charAt(0).toUpperCase() + s.slice(1)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{form.formState.errors.status && (
					<p className="text-red-600 text-sm">
						{form.formState.errors.status.message}
					</p>
				)}
			</div>

			<div className="flex justify-end gap-2">
				<Button type="submit">Save</Button>
				<Button
					type="button"
					disabled={isLoading}
					onClick={() => {
						router.push('/admin/members');
					}}
					variant="ghost"
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
