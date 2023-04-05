export default function debounce<T extends (...args: any[]) => void>(callback: T, delay: number): (...args: Parameters<T>) => void {
	let timerId: TimerHandle;

	return function (this: any, ...args: Parameters<T>): void {
		clearTimeout(timerId);

		timerId = setTimeout(() => {
			callback.apply(this, args);
		}, delay);
	};
}
type TimerHandle = ReturnType<typeof setTimeout>;
