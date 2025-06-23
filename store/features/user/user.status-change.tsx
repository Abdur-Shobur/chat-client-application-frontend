'use client';
import React from 'react';
import { UserType } from './user.interface';
import { useStatusUserMutation } from './user.api-slice';
import { confirm } from '@/lib/confirm';
import { apiReqResponse } from '@/lib/apiResponse';
import { showToast } from '@/lib/tost';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function UserStatusChange({ user }: { user: UserType }) {
	const [updateStatus, { isLoading }] = useStatusUserMutation();

	const handleStatusChange = async (
		status: 'active' | 'inactive' | 'deleted'
	) => {
		const confirmed = await confirm({
			message: `This will change the user status to "${status}". Are you sure?`,
			CustomComponent: (
				<div className="mb-4">
					<h2 className="text-lg font-semibold text-gray-900">
						Change User Status
					</h2>
					<p className="mt-1 text-sm text-gray-600">
						Are you sure you want to change the status of this user to{' '}
						<strong>{status}</strong>? This action can be reversed.
					</p>
				</div>
			),
		});

		if (confirmed) {
			try {
				const response = await updateStatus({ id: user._id, status }).unwrap();
				if (response.statusCode === 200 && response.status) {
					apiReqResponse(response);
				} else {
					showToast({
						title: 'Update Failed',
						variant: 'destructive',
						description: 'Something went wrong. Please try again later.',
					});
				}
			} catch (error) {
				showToast({
					title: 'Error',
					variant: 'destructive',
					description: 'Failed to update user status.',
				});
			}
		}
	};

	return (
		<>
			{user.status !== 'active' && (
				<DropdownMenuItem onClick={() => handleStatusChange('active')}>
					Set Active
				</DropdownMenuItem>
			)}

			{user.status !== 'inactive' && (
				<DropdownMenuItem onClick={() => handleStatusChange('inactive')}>
					Set Inactive
				</DropdownMenuItem>
			)}

			{/* {user.status !== 'deleted' && (
				<DropdownMenuItem
					onClick={() => handleStatusChange('deleted')}
					className="text-red-500"
				>
					Delete User
				</DropdownMenuItem>
			)} */}
		</>
	);
}
