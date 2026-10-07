import DiggablePromise from "./lib/DiggablePromise.js";




function run() {

    let a = new DiggablePromise(() => 67);
    let b = a.then(

        v => {

            console.log(v);
            return v * 4

        }

        ,  e => e * 0).then(x => console.log(x))



    a.resolve(10);

}

run();


