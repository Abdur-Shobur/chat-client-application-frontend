'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useTempLoginMutation } from './auth.api-slice';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

const TempLoginSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	phone: z
		.string()
		.min(10)
		.max(15)
		.regex(/^[0-9]+$/, {
			message: 'Invalid phone number',
		}),
});

export default function TempLoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get('redirectTo') || '/';

	const [tempLogin, { isLoading }] = useTempLoginMutation();

	const form = useForm<z.infer<typeof TempLoginSchema>>({
		resolver: zodResolver(TempLoginSchema),
		defaultValues: {
			name: '',
			phone: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof TempLoginSchema>) => {
		try {
			const response = await tempLogin(data as any).unwrap();

			const result = await signIn('credentials', {
				token: JSON.stringify(response),
				redirect: false,
			});

			if (result?.ok) {
				router.replace(redirectTo);
				toast({ title: 'Logged in successfully!' });
			} else {
				toast({ title: 'Sign-in failed', description: 'Please try again.' });
			}
		} catch (error: any) {
			const apiError = error?.data;

			if (apiError?.errors?.length) {
				apiError.errors.forEach((e: any) => {
					toast({
						title: `Error in "${e.field}"`,
						description: e.message,
						variant: 'destructive',
					});
				});
			} else {
				toast({
					title: 'Temporary login failed',
					description: apiError?.message || 'Try again later.',
					variant: 'destructive',
				});
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Your name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input placeholder="Phone number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading} className="w-full">
					{isLoading ? 'Joining...' : 'Join Now'}
				</Button>
			</form>
		</Form>
	);
}
