'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useLoginMutation, useRegistrationMutation } from './auth.api-slice';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

const RegFormSchema = z
	.object({
		name: z
			.string({ required_error: 'Name is required' })
			.min(2, { message: 'Name must be at least 2 characters.' }),
		email: z.string().optional(),
		phone: z
			.string()
			.regex(/^\+?[0-9]{7,15}$/, { message: 'Invalid phone number' }) // Optional: regex for phone
			.optional(),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters.' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})
	.refine((data) => data.email || data.phone, {
		message: 'Either email or phone number is required',
		path: ['email'], // You can use 'email' or 'phone' here
	});

// Basic phone number regex (you can customize it)
const phoneRegex = /^[0-9]{10,15}$/;

const FormSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email or phone is required' })
		.refine(
			(val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || phoneRegex.test(val),
			{ message: 'Must be a valid email or phone number' }
		),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters.' }),
});

export function AuthTab() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get('redirectTo') || '/';

	// Login
	const [login, { isLoading: loginLoading, isError: isLoginError }] =
		useLoginMutation();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			const response = await login(data).unwrap();
			const result = await signIn('credentials', {
				token: JSON.stringify(response),
				redirect: false,
			});

			if (result?.ok) {
				router.replace(redirectTo);
				form.reset();
				toast({ title: 'Login successful!' });
			}
		} catch (error) {
			// Narrow the type
			if (
				typeof error === 'object' &&
				error !== null &&
				'status' in error &&
				'data' in error &&
				typeof (error as any).data === 'object' &&
				(error as any).data !== null &&
				'message' in (error as any).data
			) {
				const err = error as { status: number; data: { message: string } };

				if (err.status === 404) {
					toast({
						title: 'Login failed',
						description: err.data.message,
					});
					return;
				}
			}

			// Fallback toast
			toast({
				title: 'Unexpected error',
				description: 'Something went wrong. Please try again.',
			});
		}
	}

	// Registration
	const [registration, { isLoading: regLoading }] = useRegistrationMutation();
	const regForm = useForm<z.infer<typeof RegFormSchema>>({
		resolver: zodResolver(RegFormSchema),
		defaultValues: { name: '', password: '', confirmPassword: '', email: '' },
	});

	async function regOnSubmit(data: z.infer<typeof RegFormSchema>) {
		try {
			const response = await registration(data as any).unwrap();
			const result = await signIn('credentials', {
				token: JSON.stringify(response),
				redirect: false,
			});

			if (result?.ok) {
				router.replace(redirectTo);
				regForm.reset();
				toast({ title: 'Registration successful!' });
			}
		} catch (error: any) {
			if (
				error?.status === 409 &&
				error?.data?.errors &&
				Array.isArray(error.data.errors)
			) {
				error.data.errors.forEach((err: { field: string; message: string }) => {
					regForm.setError(err.field as keyof z.infer<typeof RegFormSchema>, {
						type: 'manual',
						message: err.message,
					});
				});
			} else {
				toast({
					title: 'Registration failed',
					description: 'An unexpected error occurred.',
					variant: 'destructive',
				});
			}
		}
	}

	return (
		<Tabs defaultValue="account" className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="account">Login</TabsTrigger>
				<TabsTrigger value="password">Registration</TabsTrigger>
			</TabsList>

			<TabsContent value="account">
				<Card>
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>
							Enter your email or phone and password to log in.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="login-email">
												Email or phone
											</FormLabel>
											<FormControl>
												<Input
													id="login-email"
													autoComplete="off"
													type="email"
													placeholder="Email or Phone"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="login-password">Password</FormLabel>
											<FormControl>
												<Input
													id="login-password"
													placeholder="Password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button disabled={loginLoading} type="submit">
									{loginLoading ? 'Submitting...' : 'Submit'}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Registration</CardTitle>
						<CardDescription>Create an account to get started.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...regForm}>
							<form
								onSubmit={regForm.handleSubmit(regOnSubmit)}
								className="space-y-4"
							>
								<FormField
									control={regForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="reg-name">Name</FormLabel>
											<FormControl>
												<Input id="reg-name" placeholder="Name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={regForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="reg-email">Email</FormLabel>
											<FormControl>
												<Input id="reg-email" placeholder="Email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={regForm.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="reg-phone">Phone</FormLabel>
											<FormControl>
												<Input id="reg-phone" placeholder="Phone" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={regForm.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="reg-password">Password</FormLabel>
											<FormControl>
												<Input
													id="reg-password"
													placeholder="Password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={regForm.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="confirm-password">
												Confirm Password
											</FormLabel>
											<FormControl>
												<Input
													id="confirm-password"
													placeholder="Confirm Password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button disabled={regLoading} type="submit">
									{regLoading ? 'Submitting...' : 'Submit'}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
