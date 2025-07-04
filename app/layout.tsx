import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { RootProviders } from '@/provider';
import localFont from 'next/font/local';

export const metadata: Metadata = {
	title: 'Chat On',
	description: 'Chat On is a chat application',
};
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<RootProviders>
					<main>{children}</main>
				</RootProviders>
				<Toaster />
			</body>
		</html>
	);
}
