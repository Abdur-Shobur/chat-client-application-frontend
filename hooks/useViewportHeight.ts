'use client';
import { useEffect } from 'react';

export default function useViewportHeight() {
	useEffect(() => {
		const setVH = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};

		setVH();

		window.addEventListener('resize', setVH);
		return () => window.removeEventListener('resize', setVH);
	}, []);
}
