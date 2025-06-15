'use client';
import { AppStore, makeStore } from '@/store';

import { setupListeners } from '@reduxjs/toolkit/query';
import { SessionProvider } from 'next-auth/react';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from './theme-provider';
export const RootProviders = ({ children }: { children: React.ReactNode }) => {
	const storeRef = useRef<AppStore | null>(null);

	if (!storeRef.current) {
		// Create the store instance the first time this renders
		storeRef.current = makeStore();
	}

	useEffect(() => {
		if (storeRef.current != null) {
			// configure listeners using the provided defaults
			// optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
			const unsubscribe = setupListeners(storeRef.current.dispatch);
			return unsubscribe;
		}
	}, []);
	return (
		<ThemeProvider attribute="class" defaultTheme="light">
			<SessionProvider>
				<Provider store={storeRef.current}>{children}</Provider>
			</SessionProvider>
		</ThemeProvider>
	);
};
