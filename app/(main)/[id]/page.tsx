import { MailDisplay } from '@/app/components/mail-display';
import { mails } from '@/app/data';

export default function MailPage({}: { params: { id: string } }) {
	return <MailDisplay mail={mails[0]} />;
}
