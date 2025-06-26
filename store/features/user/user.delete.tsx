'use client';
import React from 'react';
import { UserType } from './user.interface';
import { useDeleteUserMutation } from './user.api-slice';
import { confirm } from '@/lib/confirm';
import { apiReqResponse } from '@/lib/apiResponse';
import { showToast } from '@/lib/tost';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
export default function UserDelete({ user }: { user: UserType }) {
	const [deleteUser, { isLoading }] = useDeleteUserMutation();

	const handleDelete = async () => {
		const confirmed = await confirm({
			message:
				'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
			CustomComponent: (
				<div className="mb-4">
					<h2 className="text-lg font-semibold text-gray-900">
						Are you absolutely sure?
					</h2>
					<p className="mt-1 text-sm text-gray-600">
						This action cannot be undone. This will permanently delete the
						account and remove the data.
					</p>
				</div>
			),
		});
		if (confirmed) {
			const response = await deleteUser(user._id).unwrap();
			if (response.statusCode === 200 && response.status) {
				apiReqResponse(response);
			} else {
				showToast({
					title: 'Please Wait!',
					variant: 'destructive',
					description: 'Something Is Wrong, Please Try Again',
				});
			}
		} else {
		}
	};

	return (
		<DropdownMenuItem className="text-red-500" onClick={handleDelete}>
			Delete{isLoading && '...'}
		</DropdownMenuItem>
	);
}
