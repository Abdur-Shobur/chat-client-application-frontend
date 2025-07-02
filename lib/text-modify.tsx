import DOMPurify from 'dompurify';
import { linkify } from './linkify';

export function MessageComponent({ message }: { message: { text: string } }) {
	const safeHtml = DOMPurify.sanitize(linkify(message.text), {
		ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
	});

	return (
		<div
			className="text-sm whitespace-pre-wrap"
			dangerouslySetInnerHTML={{ __html: safeHtml }}
		/>
	);
}
