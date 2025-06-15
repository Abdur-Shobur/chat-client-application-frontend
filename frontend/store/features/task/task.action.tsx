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
import { apiDelete } from '../basic-api';
import { UpdateTask } from './task.update';
import { useDeleteTaskMutation, useStatusTaskMutation } from './task.api-slice';
import { TaskType } from './task.interface';

export function TaskAction({ task }: { task: TaskType }) {
	const [deleteUser, { isLoading }] = useDeleteTaskMutation();
	const [statusUpdate, { isLoading: isLoadingStatus }] =
		useStatusTaskMutation();
	const [openDialog, setOpenDialog] = useState(false);

	const handelStatus = async (id: string, status: typeof task.status) => {
		try {
			const response = await statusUpdate({ id, status });
			console.log(response);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="absolute right-1 top-1">
					<Button size="icon" variant="outline" type="button">
						{isLoading || isLoadingStatus ? (
							<LoaderCircle className="animate-spin" />
						) : (
							<EllipsisVertical />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{/* Trigger dialog */}
					<DropdownMenuItem onClick={() => setOpenDialog(true)}>
						Edit Task
					</DropdownMenuItem>
					{task.status !== 'pending' && (
						<DropdownMenuItem
							onClick={() => {
								handelStatus(task.id, 'pending');
							}}
						>
							Pending
						</DropdownMenuItem>
					)}

					{task.status !== 'in-progress' && (
						<DropdownMenuItem
							onClick={() => {
								handelStatus(task.id, 'in-progress');
							}}
						>
							In Progress
						</DropdownMenuItem>
					)}
					{task.status !== 'done' && (
						<DropdownMenuItem
							onClick={() => {
								handelStatus(task.id, 'done');
							}}
						>
							Done
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							apiDelete({
								deleting: deleteUser,
								id: task.id,
							});
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Separate UpdateUser dialog */}
			<UpdateTask task={task} open={openDialog} setOpen={setOpenDialog} />
		</>
	);
}
