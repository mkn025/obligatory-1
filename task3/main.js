// Grab the canvas from the DOM and get its 2D rendering context.
// We'll use this to draw the uploaded image and later to draw the processed image.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create a Web Worker that will run image processing in a separate thread.
// This keeps the UI responsive while the heavy work will be happening.
const worker = new Worker('worker.js');

const new_worker = new Worker('new_worker.js');

const completedActivities = new Set();
let pendingHash           = null;
const HASH_MESSAGE        = 'maknu0536@uib.no'

// We'll store the current image's pixel data here once the user uploads an image.
let imageData;

// When the user selects a file (image), load it and draw it on the canvas.

document.getElementById('upload').addEventListener('change', (e) => {

  const file = e.target.files[0];
  if (!file) return; // nothing selected

  const img = new Image();
  img.onload = () => {
    
    // Resize canvas to match the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Read the raw RGBA pixel data from the canvas
    // This gives us an `ImageData` object with a `Uint8ClampedArray` inside
    // https://developer.mozilla.org/en-US/docs/Web/API/ImageData
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  // Turn the uploaded file into a blob URL so <img> can load it
  img.src = URL.createObjectURL(file);
});

/**
 * Called when the user clicks transform button.
 * @param {string} type - transform, ...
 */
function applyFilter(type) {
  // Make sure we actually have an image loaded
  if (!imageData) {
    console.warn('No image loaded yet');
    return;
  }
 
  // Make a copy of the pixel data.
  // `imageData.data` is a live array tied to the canvas (i.e., we get access to the real pixels on the canvas).
  // We don't want to mutate it while the worker runs.
  const copy = new Uint8ClampedArray(imageData.data);

  console.log(copy);
  console.log(`Sending ${type} filter to worker`);

  // Send a message to the worker.
  // We pass:
  // - the filter type
  // - The activity name
  // - the raw `ArrayBuffer` backing the pixel array
  // - width and height of the image (so the worker can send them back)
  //
  // The second argument ([copy.buffer]) TRANSFERS the buffer to the worker
  // so it's not copied — it's moved.
  worker.postMessage(
    {
    type,
    activity: type,
    buffer: copy.buffer,
    length: copy.length,
    width: canvas.width,
    height: canvas.height
  }, [copy.buffer] // transfer
);

 // Note: `postmessage` has two arguments here:
 // - the object we want to send
 // - an array of objects whose ownership we want to TRANSFER instead of copying
 // We do this to avoid copying large buffers between threads.
 // This means that the worker takes over the same memory for speed.
}

// Listen for processed image data coming back from the worker
worker.onmessage = (e) => {

  console.log('Main thread received the processed buffer');
  const { buffer, width, height, activity } = e.data;

  // Recreate a typed array on top of the buffer we got from the worker.
  // `result` refers to the same bytes stored in that buffer, without copying them.
  const result = new Uint8ClampedArray(buffer);
  
  console.log(result);
  console.log('Result length:', result.length);

  // Turn raw pixels back into an `ImageData` object so the canvas can draw it
  const imageData = new ImageData(result, width, height);
  ctx.putImageData(imageData, 0, 0);

  completedActivities.add(activity);
  showHashIfReady();
};


function callFourthActivity() {

  const buffer = new TextEncoder()
    .encode(HASH_MESSAGE)
    .buffer;

  new_worker.postMessage({ buffer }, [buffer]);

}


function showHashIfReady() {

  if (pendingHash === null || completedActivities.size < 4 || !imageData) {

    console.log("wrong hash")
    return;
  }

  const output = document.getElementById('hash-output');
  output.textContent = `SHA-256: ${pendingHash}`;

  pendingHash = null;
}

new_worker.onmessage = (e) => {



  if (e.data.error) {
    console.error(e.data.error);
    return;
  }

  pendingHash = e.data.hash;
  showHashIfReady();
};
