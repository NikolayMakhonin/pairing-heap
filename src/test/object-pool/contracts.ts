export interface IObjectPool<TObject> {
	size: number
	maxSize: number

	get(): TObject|undefined|null

	release(obj: TObject): void
}
