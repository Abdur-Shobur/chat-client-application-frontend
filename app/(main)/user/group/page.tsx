import { Separator } from '@/components/ui/separator';
import { GroupView } from '@/store/features/group';

export default function Page() {
	return (
		<>
			<div className="flex items-center px-4 py-3">
				<h1 className="text-xl font-bold">Group</h1>
			</div>
			<Separator />
			<div className="p-2">
				<GroupView />
			</div>
		</>
	);
}
