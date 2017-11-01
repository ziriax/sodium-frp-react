import * as S from "sodiumjs"

export interface Sink<T = any> {
    send(value: T): void;
}

export type RecordOfCell<T> = {[K in keyof T]: S.Cell<T[K]> };

export type CellOfRecord<T> = S.Cell<{[K in keyof T]: T[K]}>;

export type RecordOfStream<T> = {[K in keyof T]: S.Stream<T[K]> };

export type StreamOfRecord<T> = S.Stream<{[K in keyof T]: T[K]}>;

export type KeysOf<T> = (keyof T)[];

export function assertNever(value: never): never {
    throw new Error("assertNever failed");
}

/** Returns the typed keys of a record object */
export function keysOf<T>(record: T): KeysOf<T> {
    return Object.keys(record) as any;
}

/** Is the value defined */
export function isDefined<T>(value: T | undefined): value is T {
    return value !== void 0;
}

/** Can we dot into the value, ie is the value defined and not-null? */
export function isDottable<T>(value: T | null | undefined): value is T {
    return value !== null && value !== void 0;
}

/** The keys for the empty object */
export const emptyKeys = keysOf({});

/** Split a stream of a single record into a single record of streams  */
export function splitStream<T>(keys: KeysOf<T>, streamOfRecord: StreamOfRecord<T>): RecordOfStream<T> {
    return keys.reduce((recordOfStream: any, key) => ({
        ...recordOfStream,
        [key]: streamOfRecord.map(r => r[key])
    }), {});
}

/** Split a cell of a single record into a single record of cells  */
export function splitCell<T>(cellOfRecord: CellOfRecord<T>): RecordOfCell<T> {
    const initial = cellOfRecord.sample();
    const keys = keysOf(initial);
    const recordOfStream = splitStream<T>(keys, S.Operational.updates(cellOfRecord));
    return keys.reduce((recordOfCell: any, key) => ({
        ...recordOfCell,
        [key]: new S.Cell<any>(initial[key], recordOfStream[key])
    }), {});
}

/** Merge a single record of cells into a cell of a single record */
export function mergeCells<T>(recordOfCell: RecordOfCell<T>): CellOfRecord<T> {
    return keysOf(recordOfCell).reduce((cellOfRecord: any, key) => {
        return cellOfRecord.lift(recordOfCell[key], (field: any, value: any) => ({
            ...field,
            [key]: value
        }));
    }, new S.Cell<any>({}));
}

// https://vincent.billey.me/pure-javascript-immutable-array/
export function immutableSplice<T>(arr: ReadonlyArray<T>, start: number, deleteCount: number, ...items: T[]): ReadonlyArray<T> {
    return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
}

/** Transforms an array of cell to a cell of array, applying a custom transformation function to each value */
export function flatMapCells<T, R>(cells: ReadonlyArray<S.Cell<T>>, transform: (value: T, index: number) => R): S.Cell<ReadonlyArray<R>> {
    return cells.reduce((output$, cell$, index) =>
        output$.lift(cell$, (output, value) => immutableSplice(output, index, 1, transform(value, index))),
        new S.Cell<ReadonlyArray<R>>([]));
}

/** Transforms an array of cell to a cell of array */
export function flattenCells<T>(cells: ReadonlyArray<S.Cell<T>>): S.Cell<ReadonlyArray<T>> {
    return flatMapCells(cells, x => x);
}
