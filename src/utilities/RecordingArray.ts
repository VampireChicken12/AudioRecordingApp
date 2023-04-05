import { Recording } from "@/types";

export default class RecordingsArray extends Array<Recording> {
	constructor(elements?: Recording[]) {
		super();
		if (elements) {
			this.push(...elements);
		}
	}
	private _currentIndex: number = 0;
	public get currentIndex(): number {
		return this._currentIndex;
	}
	public setCurrentIndex(index: number): void {
		this._currentIndex = index;
	}
	public get next(): Recording | undefined {
		if (this[this.currentIndex + 1]) {
			return this[this.currentIndex + 1];
		} else {
			return undefined;
		}
	}
	public get hasNext(): boolean {
		return this[this.currentIndex + 1] !== undefined;
	}
	public get previous(): Recording | undefined {
		if (this[this.currentIndex - 1]) {
			return this[this.currentIndex - 1];
		} else {
			return undefined;
		}
	}
	public get hasPrevious(): boolean {
		return this[this.currentIndex - 1] !== undefined;
	}
}
