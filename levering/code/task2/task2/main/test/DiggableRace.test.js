import DiggablePromise from "../lib/DiggablePromise.js";

describe('DiggableRace', () => {

  {
    let ap_1 = new DiggablePromise(() => "foo");
    let ap_2 = new DiggablePromise(() => "bar");
    let ap_3 = new DiggablePromise(() => 100);
    let ap_4 = DiggablePromise.race([ap_1, ap_2, ap_3]);
    setTimeout(() => {
      ap_2.resolve("foo");
    }, 500);
    setTimeout(() => ap_4.dig(), 1000);

    test('promise ap_4 should be ["foo"]', () => {
      expect(ap_4._promise).resolves.toEqual("foo");
    });
  }

  {
    let ap_1 = new DiggablePromise(() => "foo");
    let ap_2 = new DiggablePromise(() => "bar");
    let ap_3 = new DiggablePromise(() => 100);
    let ap_4 = DiggablePromise.race([ap_1, ap_2, ap_3]);

    setTimeout(() => {
      ap_1.reject("zoo");
      ap_3.reject(50);
      ap_2.resolve("zar");
    }, 500);

    setTimeout(() => ap_4.dig(), 1000);

    test('promise ap_4 should be ["zoo"]', () => {
      expect(ap_4._promise).rejects.toEqual("zoo");
    });
  }

  {
    let ap_1 = new DiggablePromise(() => "foo");
    let ap_2 = new DiggablePromise(() => "bar");
    let ap_3 = new DiggablePromise(() => 100);
    let ap_4 = DiggablePromise.race([ap_1, ap_2, ap_3]);

    setTimeout(() => {
      ap_1.reject("zoo");
      ap_2.reject("zar");
      ap_3.reject(50);
    }, 500);


    setTimeout(() => ap_4.dig(), 1000);

    test('promise ap_4 should reject to ["zoo"]', () => {
      expect(ap_4._promise).rejects.toEqual("zoo");
    });
  }

  {
    let ap_1 = new DiggablePromise(() => "foo");
    let ap_2 = new DiggablePromise(() => "bar");
    let ap_3 = new DiggablePromise(() => 100);
    let ap_4 = DiggablePromise.race([ap_1, ap_2, ap_3]);

    setTimeout(() => {
      ap_1.resolve("zoo");
      ap_2.reject("zar");
      ap_3.resolve(50);
    }, 2000);


    setTimeout(() => ap_4.dig(), 1000);

    test('promise ap_4 should be ["foo"]', () => {
      expect(ap_4._promise).resolves.toEqual("foo");
    });
  }
});