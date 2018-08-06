import { AsyncStorageDriver } from '../types';

// clear all!!!
// function clear() {
// 	let i: number, key: string;
// 	for (i = localStorage.length - 1; i >= 0; i--) {
// 		key = localStorage.key(i) as string;
// 		localStorage.removeItem(key);
// 	}
// }

export class LocalStorageDriver implements AsyncStorageDriver {
	private readonly _localStorage: Storage;

	constructor() {
		this._localStorage = window.localStorage;
	}

	get name(): string {
		return 'localstorageDriver';
	}

	async getItem(key: string): Promise<string | null> {
    const localStorage = this._localStorage;
		const promise: Promise<string | null> = new Promise((resolve) => {
			const result: string | null = localStorage.getItem(key);
			resolve(result);
		});
		return promise;
	}

	async setItem(key: string, value: string): Promise<void> {
		const localStorage = this._localStorage;
		const promise: Promise<void> = new Promise(resolve => {
			localStorage.setItem(key, value);
			resolve();
		});
		return promise;
	}

	async removeItem(key: string): Promise<void> {
		const localStorage = this._localStorage;
		const promise: Promise<void> = new Promise(resolve => {
			localStorage.removeItem(key);
			resolve();
		});
		return promise
	}
}
