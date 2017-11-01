/// <reference types="jest" />

import * as H from "./helpers"
import * as S from "sodiumjs"

interface TestRecord {
    a: number;
    b: number;
}

class TestClass {
    a = 1;
    b = 2;

    get c() { return 3; }

    d() { return 4; }

    static e = 4;
}

describe("keysOf", () => {
    test('empty object', () => {
        expect(H.keysOf({})).toMatchObject([]);
    });

    test('record object', () => {
        expect(H.keysOf({ a: 1, b: 2 })).toMatchObject(["a", "b"]);
    });

    test('nested object', () => {
        expect(H.keysOf({ a: 1, b: { c: 2 } })).toMatchObject(["a", "b"]);
    });

    test('instance object', () => {
        expect(H.keysOf(new TestClass())).toMatchObject(["a", "b"]);
    });
});

describe("splitStream", () => {
    test('empty', () => {
        const sink = new S.StreamSink<{}>();
        const split = H.splitStream(H.emptyKeys, sink);
        expect(H.keysOf(split)).toMatchObject([]);
    });


    test('maps keys', () => {
        const sink = new S.StreamSink<TestRecord>();
        const split = H.splitStream(["a", "b"], sink);
        expect(H.keysOf(split)).toMatchObject(["a", "b"]);
    });

    test('delegates', () => {
        const sink = new S.StreamSink<TestRecord>();
        const split = H.splitStream(["a", "b"], sink);

        let values: Partial<TestRecord> = {};
        split.a.listen(x => values.a = x);
        split.b.listen(x => values.b = x);

        sink.send({ a: 1, b: 2 });
        expect(values.a).toBe(1);
        expect(values.b).toBe(2);

        sink.send({ a: 3, b: 4 });
        expect(values.a).toBe(3);
        expect(values.b).toBe(4);
    });
});

describe("mergeCells", () => {
    test('delegates', () => {
        const sinks = {
            a: new S.CellSink<number>(1),
            b: new S.CellSink<number>(2)
        };

        const merged = H.mergeCells(sinks);

        let state: Partial<TestRecord> = {};
        merged.listen(x => state = x);

        expect(state).toMatchObject({ a: 1, b: 2 });

        sinks.a.send(3);
        expect(state).toMatchObject({ a: 3, b: 2 });

        sinks.b.send(4);
        expect(state).toMatchObject({ a: 3, b: 4 });
    });
});


describe("splitCells", () => {
    test('empty', () => {
        const sink = new S.CellSink<{}>({});
        const split = H.splitCell(sink);
        expect(H.keysOf(split)).toMatchObject([]);
    });

    test('maps keys', () => {
        const sink = new S.CellSink<TestRecord>({ a: 1, b: 2 });
        const split = H.splitCell(sink);
        expect(H.keysOf(split)).toMatchObject(["a", "b"]);
    });

    test('delegates', () => {
        const sink = new S.CellSink<TestRecord>({ a: 1, b: 2 });
        const split = H.splitCell(sink);
        expect(split.a.sample()).toBe(1);
        expect(split.b.sample()).toBe(2);
        
        let values: Partial<TestRecord> = {};
        split.a.listen(x => values.a = x);
        split.b.listen(x => values.b = x);

        sink.send({ a: 3, b: 4 });
        expect(values.a).toBe(3);
        expect(values.b).toBe(4);

        sink.send({ a: 5, b: 6 });
        expect(values.a).toBe(5);
        expect(values.b).toBe(6);
    });
});



