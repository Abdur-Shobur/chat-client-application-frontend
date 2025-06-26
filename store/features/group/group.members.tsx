'use client';
import React, { useState, useMemo } from 'react';
import { useGroupByIdQuery } from './group.api-slice';
import MemberRemove from './member.remove';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GroupMembers({ groupId }: { groupId: string }) {
	const { data: groupData, isLoading } = useGroupByIdQuery(
		{ id: groupId },
		{
			skip: !groupId,
		}
	);
	const [searchTerm, setSearchTerm] = useState('');

	const filteredMembers = useMemo(() => {
		const term = searchTerm.toLowerCase();

		return (
			groupData?.data?.members?.filter((member: any) => {
				return (
					member.name.toLowerCase().includes(term) ||
					member.phone.toLowerCase().includes(term)
				);
			}) || []
		);
	}, [searchTerm, groupData]);

	// Export CSV logic
	const handleExportCSV = () => {
		const headers = ['Name', 'Phone'];
		const rows = filteredMembers.map((member: any) => [
			member.name,
			member.phone,
		]);

		const csvContent =
			'data:text/csv;charset=utf-8,' +
			[headers, ...rows].map((e) => e.join(',')).join('\n');

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'group_members.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
				{Array.from({ length: 9 }, (_, index) => (
					<div key={index} className="flex flex-col space-y-3">
						<Skeleton className="h-[125px] w-[250px] rounded-xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
				))}
			</div>
		);
	}
	return (
		<div className="space-y-4">
			{/* Search and Export */}
			<div className="flex justify-between items-center gap-4">
				<Input
					type="text"
					placeholder="Search by name or phone..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button onClick={handleExportCSV}>
					<FileDown />
					<span>Export</span>
				</Button>
			</div>

			{/* Member Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{filteredMembers.map((member: any) => (
					<div
						key={member._id}
						className="border p-4 rounded shadow-sm bg-white"
					>
						<h3 className="text-lg font-medium capitalize">{member.name}</h3>
						<p className="text-sm text-gray-700">Email: {member.email}</p>
						<p className="text-sm text-gray-700">Phone: {member.phone}</p>
						<p className="text-sm text-gray-500">Status: {member.status}</p>
						{member?._id && (
							<MemberRemove groupId={groupId} userId={member._id} />
						)}
					</div>
				))}
			</div>
		</div>
	);
}
