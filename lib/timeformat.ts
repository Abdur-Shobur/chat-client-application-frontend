import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function formatMessageTime(utcDateString: string) {
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const utcDate = new Date(utcDateString);
	const localDate = toZonedTime(utcDate, userTimeZone);

	return format(localDate, 'MMM d, h:mm a'); // e.g., "Jul 14, 8:12 AM"
}
