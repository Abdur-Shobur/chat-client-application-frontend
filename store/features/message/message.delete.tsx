'use client';

import React from 'react';
import { Trash } from 'lucide-react';

export default function MessageDelete({
	handleDelete,
}: {
	handleDelete: () => void;
}) {
	return (
		<button
			onClick={handleDelete}
			className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
			aria-label="Delete Message"
			title="Delete Message"
		>
			<Trash size={18} />
		</button>
	);
}
