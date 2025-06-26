'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TempLoginForm from './auth.temp';

export function AuthLoginTab() {
	return (
		<Tabs defaultValue="account" className="w-[400px]">
			<TabsContent value="account">
				<Card className="pt-6">
					<CardContent>
						<TempLoginForm />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
