import { MailDisplay } from '@/app/components/mail-display';
import { mails } from '@/app/data';
import { notFound } from 'next/navigation';

export default function MailPage({ params }: { params: { id: string } }) {
	return <MailDisplay mail={mails[0]} />;
}
