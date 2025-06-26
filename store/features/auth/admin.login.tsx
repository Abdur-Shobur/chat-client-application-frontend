'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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
import { useLoginMutation } from './auth.api-slice';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

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

export function AdminAuthLoginTab() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get('redirectTo') || '/';

	// Login
	const [login, { isLoading: loginLoading }] = useLoginMutation();
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

	return (
		<Tabs defaultValue="password" className="w-[400px]">
			<TabsContent value="password">
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

								<Button
									type="submit"
									disabled={loginLoading}
									className="w-full"
								>
									{loginLoading ? 'Logging in...' : 'Login'}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
