let p1resolve;
let p1 = new Promise((resolve,reject) => { p1resolve = resolve/* some code here */ }); 
let p2 = p1.then( (val) => { console.log(`p2 (f1): received ${val}`); return val + 1; } /*some fulfill reaction `f1`*/ );
let p3 = p2.then( (val) => { console.log(`p3 (f2): received ${val}`); return val * 2; } /*some fulfill reaction `f2`*/ );
p3.then( (val) => { console.log(`p3.then (f3): received ${val}, final value ${val}`); } /* some fulfill reaction `f3` */ );

p1.resolve = p1resolve;
p1.resolve(100);
  // Here is what happens when this line is executed:
    // - step I: we resolved `p1` to `100`
    // - step II: this will trigger `f1` to execute, and `p2` will be resolved with the value `f1(100)`
    // - step III: this will trigger `f2` to execute, and `p3` will be resolved with the value `f2(f1(100))`
    // - step IV: this will trigger `f3` to execute, and `p3.then(...)` will be resolved with the value `f3(f2(f1(100)))`