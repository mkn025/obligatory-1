import DiggablePromise from "../lib/DiggablePromise.js";

describe('DiggableFinally', () => {

  {
    let log = [];

    let d_promise_1 = new DiggablePromise(() => 32); //digging function is then ()=>32
    let d_promise_2 = d_promise_1.then((x) => x * 2);
    let d_promise_3 = d_promise_2.then((x) => x + 10);
    let f_promise_1 = d_promise_1.finally(() => log.push("Promise " + 1));
    let f_promise_2 = d_promise_2.finally(() => log.push("Promise " + 2));
    let f_promise_3 = d_promise_3.finally(() => log.push("Promise " + 3));

    setTimeout(() => d_promise_1.resolve(16), 5000);
    setTimeout(() => d_promise_3.dig(), 1000);

    test("promise 1 should be 32: ", () => {
      return expect(d_promise_1._promise).resolves.toBe(32);
    });

    test("promise 2 should be 64: ", () => {
      return expect(d_promise_2._promise).resolves.toBe(64);
    });

    test("promise 3 should be 74: ", () => {
      return expect(d_promise_3._promise).resolves.toBe(74);
    });

    test("f_promise_1 should be same as promise 1: ", () => {
      expect(f_promise_1._promise).resolves.toBe(32);
    });

    test("f_promise_2 should be same as promise 2: ", () => {
      expect(f_promise_2._promise).resolves.toBe(64);
    });

    test("f_promise_3 should be same as promise 3: ", () => {
      expect(f_promise_3._promise).resolves.toBe(74);
    });

    test("log should be filled in correct order: ", () => {
      expect(log).toEqual(["Promise 1", "Promise 2", "Promise 3"]);
    });
  }

  {
    let log = [];

    let d_promise_1 = new DiggablePromise(() => 32); //digging function is then ()=>32
    let d_promise_2 = d_promise_1.then((x) => x * 2);
    let d_promise_3 = d_promise_2.then((x) => x + 10);
    let f_promise_1 = d_promise_1.finally(() => log.push("Promise " + 1));
    let f_promise_3 = d_promise_3.finally(() => log.push("Promise " + 3));

    setTimeout(() => d_promise_1.resolve(16), 5000);
    setTimeout(() => d_promise_3.dig(), 1000);

    test("promise 1 should be 32: ", () => {
      return expect(d_promise_1._promise).resolves.toBe(32);
    });

    test("promise 2 should be 64: ", () => {
      return expect(d_promise_2._promise).resolves.toBe(64);
    });

    test("promise 3 should be 74: ", () => {
      return expect(d_promise_3._promise).resolves.toBe(74);
    });

    test("f_promise_1 should be same as promise 1: ", () => {
      expect(f_promise_1._promise).resolves.toBe(32);
    });

    test("f_promise_3 should be same as promise 3: ", () => {
      expect(f_promise_3._promise).resolves.toBe(74);
    });

    test("log should be filled in correct order: ", () => {
      expect(log).toEqual(["Promise 1", "Promise 3"]);
    });
  }
});