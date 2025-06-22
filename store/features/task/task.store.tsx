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
import { useState } from 'react';
import { useStoreTaskMutation } from './task.api-slice';
import { Textarea } from '@/components/ui/textarea';
const FormSchema = z.object({
	title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
	description: z
		.string()
		.min(2, { message: 'Description must be at least 2 characters.' }),
});
export function CreateTask() {
	const [open, setOpen] = useState(false);

	// Login
	const [login, { isLoading: loginLoading, error: loginError }] =
		useStoreTaskMutation();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { title: '', description: '' },
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
				form.reset();
			}
		} catch (error) {
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
				<Button variant="outline">Create Task</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Task</DialogTitle>
					<DialogDescription>Create New Task</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="title">Title</FormLabel>
									<FormControl>
										<Input id="title" placeholder="Title" {...field} />
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
									<FormLabel htmlFor="description">Description</FormLabel>
									<FormControl>
										<Textarea
											id="description"
											placeholder="description"
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
