'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, LoaderCircle } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserType } from './user.interface';
import { useDeleteUserMutation } from './user.api-slice';
import { apiDelete } from '../basic-api';
import { UpdateUser } from './user.update';

export function UserAction({ user }: { user: UserType }) {
	const [deleteUser, { isLoading }] = useDeleteUserMutation();
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="absolute right-1 top-1">
					<Button size="icon" variant="outline" type="button">
						{isLoading ? (
							<LoaderCircle className="animate-spin" />
						) : (
							<EllipsisVertical />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{/* Trigger dialog */}
					<DropdownMenuItem onClick={() => setOpenDialog(true)}>
						Edit User
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							apiDelete({
								deleting: deleteUser,
								id: user._id,
							});
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Separate UpdateUser dialog */}
			<UpdateUser user={user} open={openDialog} setOpen={setOpenDialog} />
		</>
	);
}
