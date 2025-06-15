'use client';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { decrement, increment, reset } from './counterSlice';
export function CounterUI() {
	const count = useAppSelector((state) => state.counter.value);
	const dispatch = useAppDispatch();

	return (
		<div className="flex justify-center items-center flex-col h-screen">
			<Card className="w-full max-w-sm mx-auto ">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Counter
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center space-y-4">
						<span className="text-4xl font-bold" aria-live="polite">
							{count}
						</span>
						<div className="flex space-x-2">
							<Button
								onClick={() => dispatch(decrement())}
								variant="destructive"
								aria-label="Decrement"
							>
								<Minus className="h-4 w-4" />
							</Button>
							<Button
								onClick={() => dispatch(increment())}
								variant="outline"
								aria-label="Increment"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						<Button
							onClick={() => dispatch(reset())}
							variant="secondary"
							className="w-full"
						>
							<RotateCcw className="h-4 w-4 mr-2" />
							Reset
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
