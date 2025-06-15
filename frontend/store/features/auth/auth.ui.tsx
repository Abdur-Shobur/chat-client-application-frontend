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
import { useRouter } from 'next/navigation';

const RegFormSchema = z
	.object({
		name: z
			.string({ required_error: 'Name is required' })
			.min(2, { message: 'Name must be at least 2 characters.' }),
		email: z.string().email({ message: 'Email is required' }),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters.' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

const FormSchema = z.object({
	email: z.string().email({ message: 'Email is required' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters.' }),
});

export function AuthTab() {
	const router = useRouter();

	// Login
	const [
		login,
		{ isLoading: loginLoading, isError: isLoginError, error: loginError },
	] = useLoginMutation();
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
				router.push('/');
				form.reset();
				toast({ title: 'Login successful!' });
			}
		} catch (error) {
			toast({
				title: 'Login failed',
				description: loginError?.data?.message || 'Error',
			});
		}
	}

	// Registration
	const [
		registration,
		{ isLoading: regLoading, isError: regIsError, error: regError },
	] = useRegistrationMutation();
	const regForm = useForm<z.infer<typeof RegFormSchema>>({
		resolver: zodResolver(RegFormSchema),
		defaultValues: { username: '', password: '', confirmPassword: '' },
	});

	async function regOnSubmit(data: z.infer<typeof RegFormSchema>) {
		try {
			const response = await registration(data).unwrap();
			const result = await signIn('credentials', {
				token: JSON.stringify(response),
				redirect: false,
			});

			if (result?.ok) {
				router.push('/');
				regForm.reset();
				toast({ title: 'Registration successful!' });
			}
		} catch (error) {
			toast({
				title: 'Registration failed',
				description: regError?.data?.message || 'Error',
			});
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
							Enter your email and password to log in.
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
											<FormLabel htmlFor="login-email">Email</FormLabel>
											<FormControl>
												<Input
													id="login-email"
													autoComplete="off"
													type="email"
													placeholder="email"
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
