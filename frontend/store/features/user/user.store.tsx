import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { useStoreUserMutation } from './user.api-slice';
import { useState } from 'react';
const FormSchema = z.object({
	username: z
		.string()
		.min(2, { message: 'Username must be at least 2 characters.' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters.' }),
});
export function CreateUser() {
	const [open, setOpen] = useState(false);

	// Login
	const [login, { isLoading: loginLoading, error: loginError }] =
		useStoreUserMutation();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { username: '', password: '' },
	});
	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			const response = await login(data).unwrap();
			if (response) {
				toast({
					title: 'Success',
					description: 'Success user created',
				});
				setOpen(false);
			}
		} catch (error: unknown) {
			if (error) {
				toast({
					title: 'Failed',
					description: 'Error',
				});
			}
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Create User</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New User</DialogTitle>
					<DialogDescription>
						Create New User and use it to login
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="login-username">Username</FormLabel>
									<FormControl>
										<Input
											id="login-username"
											placeholder="Username"
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
						<DialogFooter>
							<Button disabled={loginLoading} type="submit">
								{loginLoading ? 'Submitting...' : 'Submit'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
