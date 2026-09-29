# Obligatory 1 (JavaScript)

## Installing Node.js and npm

Please follow the instructions given at https://nodejs.org/en/download

* Choose: "Get Node.js v24.21.0 (LTS)"
* Choose: "with npm"


## Installing Emscripten

Follow the installation guide for Emscripten found here: https://emscripten.org/docs/getting_started/downloads.html


**Be sure to read the system specific notes for setup (Windows especially)**

**When setting up Emscripten, we have set up a folder in `obligatory-1\emscripten` where you can install it for this task, and delete later for ease of use, any commands given for pointing to emscripten, assumes that it is located there.**

## Running the tasks and tests

To run tests, navigate to the task folder, and run `npm install` to install dependencies needed for testing
Then run `npm run test`

To run Task 1, open the `main.html` file in a browser. VSCode should also have an integrated browser for viewing html files in the top right corner.

To run Task 2, run `npm run demo` inside `obligatory-1/task2/main`,

To run Task 3, open the `index.html` file in a browser. Remember to complete the required steps before trying to run.

## Task 1 (Goal generator)

After a long summer of football, you are back at your job as a full stack developer. 

While getting stuck trying to fix the logic of a button for your site, you keep thinking about football.
Would you be able to generate goals like Haaland if you kept playing?

Wait, generate..., thats it! You can fix the code by using a generator, but how?

-------
Consider a graphical user interface which contains a single element `box`, in this case, a button. The following piece of JavaScript code sets up event handlers for being able to drag and drop the `box` element with a mouse. A drag-and-drop sequence starts by a `mousedown` event on the `box` element, followed by any number of `mousemove` events anywhere within `window`, and ends with a `mouseup` event anywhere within `window`.

```js
let box = document.getElementById("myButton");

let dd = dragndrop(box); 
dd.next(........);
box.onmousedown    = (event) => dd.next(event);
window.onmousemove = (event) => dd.next(event);  
window.onmouseup   = (event) => dd.next(event);
```

In this code, `dragndrop` is a JavaScript generator, and it should implement the drag and drop sequence. The variable `dd` is initialized to the iterator associated with the generator. Each mouse event *resumes* `dd` with the current mouse event object (this is done by calling the `next` function with argument event, i.e., `dd.next(event)`).

**Your task is to implement the `dragndrop` generator in `task1/dragndrop.js`, whose skeleton is given below. After implementing it, test that it runs by running the html file and drag it to the goal box.**

**To complete this task, take a screenshot of the button in the goal box, remember to update the text box in `task1/dragndrop.js`**

```js
function* dragndrop(box) {
  // your code
}
```

Note that the event handlers (`box.onmousedown`, `window.onmousemove`, `window.onmouseup`) **pass an event object to the generator**.
Once your generator's `yield` **receives the event object** (let the name of that received object be `evt`), you can find out the type of the event by examining the `evt.type` property.
The relevant values are: `mousedown`, `mousemove`, and `mouseup`.
To move the `box` to the correct position (in the case where dragging has been initiated and `evt.type == mousemove`), you can simply call `move(box, evt)`.
Here is an implementation of the move function.

```js
function move(box, event) {
  box.style.left = (event.pageX - box.parentNode.offsetLeft) + "px";
  box.style.top = (event.pageY - box.parentNode.offsetTop) + "px";
}
```

## Task 2 ("Dig to the source!")

In this task, you will implement an extension of JavaScript promises. This extension provides the ability to "dig" a promise chain: an arbitrary promise anywhere in a promise chain can signal to the first promise of the promise chain to resolve.
Below is an example that gives a comparison of the ordinary JavaScript promises vs. the extension that you will be implementing in this task.

**Ordinary JavaScript as explained at the lectures (See also ``demo_promises.js``)**
```js
let p1 = new Promise((resolve,reject) => { /* some code here */ }); 
let p2 = p1.then( /*some fulfill reaction `f1`*/ );
let p3 = p2.then( /*some fulfill reaction `f2`*/ );
p3.then( /* some fulfill reaction `f3` */ );

p1.resolve(100);
  // Here is what happens when this line is executed:
    // - step I: we resolved `p1` to `100`
    // - step II: this will trigger `f1` to execute, and `p2` will be resolved with the value `f1(100)`
    // - step III: this will trigger `f2` to execute, and `p3` will be resolved with the value `f2(f1(100))`
    // - step IV: this will trigger `f3` to execute, and `p3.then(...)` will be resolved with the value `f3(f2(f1(100)))`
```


**In this task: "Diggable" JavaScript promises**
```js
let p1 = new DiggablePromise(() => 42); // a lambda function that calculates the "default" value 42
let p2 = p1.then( /*some fulfill reaction `f1`*/ );
let p3 = p2.then( /*some fulfill reaction `f2`*/ );
p3.then( /* some fulfill reaction `f3` */ );

p3.dig();
  // Here is what should happen when this line is executed:
    // Remark: note that we can call `.dig()` on any promise in the chain, and the behaviour will be the same (i.e., `p1.dig()`, `p2.dig()`, `p3.dig()` would all do the same)
    // - step I: `p1` is resolved with value `42` which was given as the "default" value in `new DiggablePromise(() => 42)`
    // - step II: this will trigger `f1` to execute, and `p2` will be resolved with the value `f1(42)`
    // - step III: this will trigger `f2` to execute, and `p3` will be resolved with the value `f2(f1(42))`
    // - step IV: this will trigger `f3` to execute, and `p3.then(...)` will be resolved with the value `f3(f2(f1(42)))
```
See `demo.js` for more examples on Diggable promises.

**Your task is to fix all TODO's in the file ``main/lib/DiggablePromise.js.``**

## Task 3 (Work Work Work)

It is a busy day for the webworkers at the office, you have been called in as an expert to help them finish their project.
They swear they are almost done, but they are struggling to launch it. Maybe you could help them start it up, and look at their final product?

To start up the project, you need to install Emscripten (See start of readme).

When Emscripten is installed, you need to compile the `image_filters.c` file to WASM, which can be done with this command. **You will need to figure out which functions to export by looking at the existing C code**

```shell
  emcc image_filters.c -o image_filters.js \
  -sEXPORTED_FUNCTIONS= #TODO \
  -sMODULARIZE \ 
  -sENVIRONMENT=worker \
  -O1
```

When compiled, take a look around in the existing code, start `index.html` and test the features on the site to get the *correct* hash

**Your task is to compile C to WASM, fix the hash in the code, and get the hash to appear on an image on the web page by playing with its features.**

**To complete this task, you have to take a screenshot with the hash on top of the image, and deliver this screenshot**

## Delivering this obligatory

Deliver folders `task1`, `task2` and the screenshots from `task1` and `task3` as a single zip file on mittuib.