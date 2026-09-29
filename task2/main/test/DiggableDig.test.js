import DiggablePromise from "../lib/DiggablePromise.js";

describe('DiggableDig', () => {

  let f_promise_1 = new DiggablePromise(() => 32); //digging function is then ()=>32
  let f_promise_2 = f_promise_1.then((x) => x * 2);
  let f_promise_3 = f_promise_2.then((x) => x + 10);
  setTimeout(() => f_promise_1.resolve(16), 5000);
  setTimeout(() => f_promise_3.dig(), 1000);

  test("promise 1 should be 32: ", () => {
    expect(f_promise_1._promise).resolves.toBe(32);
  });

  test("promise 2 should be 64: ", () => {
    expect(f_promise_2._promise).resolves.toBe(64);
  });

  test("promise 3 should be 74: ", () => {
    expect(f_promise_3._promise).resolves.toBe(74);
  });

  let p_1 = new DiggablePromise();
  let p_2 = new DiggablePromise();
  let p_3 = new DiggablePromise();
  let p_4 = DiggablePromise.all([p_1, p_2, p_3]);
  p_1.resolve("hei");
  p_2.resolve("nei");
  p_3.resolve(1);
  test('promise 4 should be ["hei","nei",1]', () => {
    expect(p_4._promise).resolves.toEqual(["hei", "nei", 1]);
  });

  {
    let fp_1 = new DiggablePromise(() => "foo");
    let fp_2 = new DiggablePromise(() => "bar");
    let fp_3 = new DiggablePromise(() => 100);
    let fp_4 = DiggablePromise.all([fp_1, fp_2, fp_3]);
    setTimeout(() => {
      fp_1.resolve("bar");
      fp_2.resolve("foo");
      fp_3.resolve(50);
    }, 2000);
    setTimeout(() => fp_4.dig(), 1000);

    test('promise fp_4 should be ["foo","bar",100]', () => {
      expect(fp_4._promise).resolves.toEqual(["foo", "bar", 100]);
    });
  }

  {
    let np_1 = new DiggablePromise(() => "foo");
    let np_2 = new DiggablePromise(() => "bar");
    let tp_1 = DiggablePromise.all([np_1, np_2]);

    let np_3 = new DiggablePromise(() => 100);
    let np_4 = new DiggablePromise(() => 200);
    let tp_2 = DiggablePromise.all([np_3, np_4]);

    let dp_1 = DiggablePromise.all([tp_1, tp_2]);
    setTimeout(() => {
      np_1.resolve("baz");
      np_2.resolve("zoo");
      np_3.resolve(50);
      np_4.resolve(60);
    }, 2000);
    setTimeout(() => dp_1.dig(), 1000);

    test('promise dp_1 should dig recursively to [["foo", "bar"], [100, 200]]', () => {
      expect(dp_1._promise).resolves.toEqual([["foo", "bar"], [100, 200]]);
    });
  }


  {
    let np_1 = new DiggablePromise(() => "foo");
    let np_2 = new DiggablePromise(() => "bar");
    let tp_1 = DiggablePromise.all([np_1, np_2]);

    let np_3 = new DiggablePromise(() => 100);
    let np_4 = new DiggablePromise(() => 200);
    let tp_2 = DiggablePromise.all([np_3, np_4]);

    let dp_1 = DiggablePromise.all([tp_1, tp_2]);
    setTimeout(() => {
      np_1.resolve("zar");
      np_4.resolve(60);
    }, 500);
    setTimeout(() => dp_1.dig(), 1000);

    test('promise dp_1 should not dig already resolved promises, and be [["zar", "bar"], [100, 60]]', () => {
      expect(dp_1._promise).resolves.toEqual([["zar", "bar"], [100, 60]]);
    });
  }
});