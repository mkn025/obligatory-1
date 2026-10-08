import DiggablePromise from "./lib/DiggablePromise.js";

const demoPromise = new Promise((resolve, reject) => {
  console.log("Demo 1:")
  let d_promise_1 = new DiggablePromise(() => 28); //digging function is then ()=>32
  let d_promise_2 = d_promise_1.then((x) => { console.log("Promise 1: " + x); return x * 2; });
  let d_promise_3 = d_promise_2.then((x) => { console.log("Promise 2: " + x); return x + 10; });

  d_promise_3.then((x) => { console.log("Promise 3: " + x) });
  setTimeout(() => d_promise_1.resolve(14), 5000);
  setTimeout(() => d_promise_3.dig(), 500);

  setTimeout(() => { resolve(2) }, 1000);

  // Expected output:
  // Promise 1: 28
  // Promise 2: 56
  // Promise 3: 66

}
).then((n) => {

  console.log("\nDemo " + n + ":");
  let d_promise_1 = new DiggablePromise(() => 32); //digging function is then ()=>32
  let d_promise_2 = d_promise_1.then((x) => { console.log("Promise 1: " + x); return x * 2; });
  let d_promise_3 = d_promise_2.then((x) => { console.log("Promise 2: " + x); return x + 10; });

  setTimeout(() => d_promise_1.resolve(16), 500);
  setTimeout(() => d_promise_3.dig(), 5000);

  return d_promise_3.then((x) => { console.log("Promise 3: " + x); return 3; });

  // Expected output:
  // Demo 2:
  // Promise 1: 16
  // Promise 2: 32
  // Promise 3: 42

}
).then((n) => {

  console.log("\nDemo " + n + ":");
  let ap_1 = new DiggablePromise(() => "foo");
  let ap_2 = new DiggablePromise(() => "bar");
  let ap_3 = new DiggablePromise(() => 100);
  let ap_4 = DiggablePromise.all([ap_1, ap_2, ap_3]);

  setTimeout(() => {
    ap_2.resolve("zar");
  }, 500);

  setTimeout(() => ap_4.dig(), 1000);
  return ap_4.then((x) => { console.log(x); return 4 });

  // Expected output:
  // Demo 3:
  // [ 'foo', 'zar', 100 ]


}
).then((n) => {

  console.log("\nDemo " + n + ":");
  let ap_1 = new DiggablePromise(() => "foo");
  let ap_2 = new DiggablePromise(() => "bar");
  let ap_3 = new DiggablePromise(() => 100);
  let ap_4 = DiggablePromise.any([ap_1, ap_2, ap_3]);

  setTimeout(() => {
    ap_2.resolve("zoo");
  }, 500);
  setTimeout(() => ap_4.dig(), 1000);

  return ap_4.then((x) => { console.log("Promise 4: " + x); return 5 });
  // Expected output:
  // Demo 4:
  // Promise 4: zoo

  
}).then((n) => {

  console.log("\nDemo " + n + ":");
  let ap_1 = new DiggablePromise(() => "foo");
  let ap_2 = new DiggablePromise(() => "bar");
  let ap_3 = new DiggablePromise(() => 100);
  let ap_4 = DiggablePromise.any([ap_1, ap_2, ap_3]);

  setTimeout(() => {
    ap_2.resolve("zoo");
  }, 1000);
  setTimeout(() => ap_4.dig(), 500);

  return ap_4.then((x) => { console.log("Promise 4: " + x); return 6 });
  // Expected output:
  // Demo 5:
  // Promise 4: foo


}).then((n) => {

  console.log("\nDemo " + n + ":");
  let ap_1 = new DiggablePromise(() => "foo");
  let ap_2 = new DiggablePromise(() => "bar");
  let ap_3 = new DiggablePromise(() => 100);
  let ap_4 = DiggablePromise.any([ap_1, ap_2, ap_3]);

  setTimeout(() => {
    ap_1.reject("zoo");
    ap_2.reject("zar");
  }, 500);
  setTimeout(() => ap_4.dig(), 1000);

  return ap_4.then((x) => { console.log("Promise 4: " + x); return 7 });
  // Expected output:
  // Demo 5:
  // Promise 4: 100


}).then((n) => {

  console.log("\nDemo " + n + ":");
  let ap_1 = new DiggablePromise(() => "foo");
  let ap_2 = new DiggablePromise(() => "bar");
  let ap_3 = new DiggablePromise(() => 100);
  let ap_4 = DiggablePromise.race([ap_1, ap_2, ap_3]);

  setTimeout(() => {
    ap_3.resolve("zoo");
  }, 500);
  setTimeout(() => ap_4.dig(), 1000);

  return ap_4.then((x) => { console.log("Promise 4: " + x); return 8 });
  // Expected output:
  // Demo 5:
  // Promise 4: "zoo"

})