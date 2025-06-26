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
import { useLoginMutation, useRegistrationMutation } from '../auth';

const RegFormSchema = z
	.object({
		username: z.string().min(2, {
			message: 'Username must be at least 2 characters.',
		}),
		password: z.string().min(8, {
			message: 'password must be at least 8 characters.',
		}),
		confirmPassword: z.string().min(8, {
			message: 'password must be at least 8 characters.',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

const FormSchema = z.object({
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
	password: z.string().min(8, {
		message: 'password must be at least 8 characters.',
	}),
});

export function AuthTab() {
	// ......................Login Form .......................
	const [
		login,
		{
			isLoading: loginLoading,
			error: loginError,
			isSuccess: isLoginSuccess,
			isError: isLoginError,
		},
	] = useLoginMutation();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		data;
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	// ......................Registration Form .......................
	const [
		registration,
		{
			isLoading: regLoading,
			error: regError,
			isSuccess: regSuccess,
			isError: regIsError,
		},
	] = useRegistrationMutation();

	const regForm = useForm<z.infer<typeof RegFormSchema>>({
		resolver: zodResolver(RegFormSchema),
		defaultValues: {
			username: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function regOnSubmit(data: z.infer<typeof RegFormSchema>) {
		// try {
		// 	const response = await registration(data).unwrap();
		// } catch (error: unknown) {}
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
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
							Enter you username and password to login and get started
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full space-y-4 border p-3 rounded-sm"
							>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input placeholder="name" {...field} />
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
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Submit</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Registration</CardTitle>
						<CardDescription>Create an account to get started</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Form {...regForm}>
							<form
								onSubmit={regForm.handleSubmit(regOnSubmit)}
								className="w-full space-y-4 border p-3 rounded-sm"
							>
								<FormField
									control={regForm.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input placeholder="name" {...field} />
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
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="password"
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
											<FormLabel>Confirm Password</FormLabel>
											<FormControl>
												<Input
													placeholder="confirm password"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Submit</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
