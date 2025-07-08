'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Settings, SquarePen } from 'lucide-react';
import {
	useProfileUpdateMutation,
	usePasswordUpdateMutation,
} from './user.api-slice';
import { useSession } from 'next-auth/react';

const profileSchema = z.object({
	name: z.string().min(2, 'Name is required'),
	email: z.string().email('Invalid email'),
	phone: z
		.string()
		.min(10, 'please enter valid phone')
		.max(15, 'please enter valid phone'),
});

const passwordSchema = z
	.object({
		currentPassword: z.string().min(8, 'Current password is required'),
		newPassword: z
			.string()
			.min(8, 'New password must be at least 8 characters')
			.max(100, 'New password cannot exceed 100 characters'),
		confirmPassword: z
			.string()
			.min(8, 'Please confirm your new password')
			.max(100, 'New password cannot exceed 100 characters'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'], // apply error to confirmPassword field
	});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfileSettingsDialog() {
	const [open, setOpen] = useState(false);
	const { data: session, update } = useSession();

	const [profileUpdate, { isLoading: profileLoading }] =
		useProfileUpdateMutation();
	const [passwordUpdate, { isLoading: passwordLoading }] =
		usePasswordUpdateMutation();

	const profileForm = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
		},
	});

	useEffect(() => {
		if (session?.user) {
			profileForm.reset({
				name: session.user.name || '',
				email: session.user.email || '',
				phone: session.user.phone || '',
			});
		}
	}, [session, profileForm]);

	const passwordForm = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
		},
	});

	const handleProfileSubmit = async (values: ProfileFormData) => {
		try {
			await profileUpdate(values).unwrap();

			// Update session only if any field changed
			const hasChanged =
				values.name !== session?.user.name ||
				values.email !== session?.user.email ||
				values.phone !== session?.user.phone;

			if (hasChanged) {
				await update({
					...session,
					user: {
						...session?.user,
						name: values.name,
						email: values.email,
						phone: values.phone,
					},
				});
			}

			toast({ title: 'Success', description: 'Profile updated successfully' });
			setOpen(false);
		} catch (err: any) {
			toast({
				title: 'Error',
				description: err?.data?.message || 'Failed to update profile',
				variant: 'destructive',
			});

			// Optional: apply form.setError() for backend validation errors
			if (err?.data?.errors && Array.isArray(err.data.errors)) {
				err.data.errors.forEach((e: { field: string; message: string }) => {
					profileForm.setError(e.field as keyof ProfileFormData, {
						type: 'manual',
						message: e.message,
					});
				});
			}
		}
	};

	const handlePasswordSubmit = async (values: PasswordFormData) => {
		try {
			await passwordUpdate({
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			}).unwrap();

			toast({ title: 'Success', description: 'Password updated successfully' });
			passwordForm.reset(); // optional: reset form
			setOpen(false);
		} catch (err: any) {
			console.log(err);

			toast({
				title: 'Error',
				description: err?.data?.message || 'Failed to update password',
				variant: 'destructive',
			});

			// 👇 Handle validation errors from backend
			if (err?.data?.errors && Array.isArray(err.data.errors)) {
				err.data.errors.forEach((e: { field: string; message: string }) => {
					passwordForm.setError(e.field as keyof PasswordFormData, {
						type: 'manual',
						message: e.message,
					});
				});
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="px-2" size="sm" type="button">
					<Settings className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-center">Update Profile</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue="profile" className="mt-4">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="password">Password</TabsTrigger>
					</TabsList>

					<TabsContent value="profile">
						<Form {...profileForm}>
							<form
								onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
								className="space-y-4 mt-4"
							>
								<FormField
									control={profileForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={profileForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type="email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={profileForm.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DialogFooter className="pt-4">
									<Button type="submit" disabled={profileLoading}>
										{profileLoading ? 'Saving...' : 'Save Profile'}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>

					<TabsContent value="password">
						<Form {...passwordForm}>
							<form
								onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
								className="space-y-4 mt-4"
							>
								<FormField
									control={passwordForm.control}
									name="currentPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Current Password</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={passwordForm.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={passwordForm.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm New Password</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DialogFooter className="pt-4">
									<Button type="submit" disabled={passwordLoading}>
										{passwordLoading ? 'Saving...' : 'Save Password'}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
