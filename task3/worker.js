// These will hold the exports and memory from the loaded WASM module
let exports;
let memory;

// Used to avoid processing messages before the WASM is actually loaded
let ready = false;

/**
 * Load and initialize the WebAssembly module that contains the
 * image-processing functions compiled from C (transforms).
 */
async function initWasm() {
    // Fetch the compiled WASM binary
    const resp = await fetch('image_filters.wasm');
    const bytes = await resp.arrayBuffer();

    // Instantiate the WASM module.
    const { instance } = await WebAssembly.instantiate(bytes, {});

    // Grab the exported functions (transforms) and memory
    exports = instance.exports;
    memory = exports.memory;        
    if (!memory) throw new Error('WASM did not export "memory"');

    // We can now process messages
    ready = true;
    console.log('WASM ready');
}

/**
 * Handle messages from the main thread.
 * Each message is expected to contain:
 *  - type: which filter to apply (transforms)
 *  - buffer: the pixel data (transferred `ArrayBuffer`)
 *  - length: number of bytes to process
 *  - width, height: image dimensions
 */
self.onmessage = (e) => {
    // If the main thread sends a message before WASM is loaded, ignore.
    if (!ready) {
        console.warn('WASM not ready yet');
        return;
    }

    const { type, buffer, length, width, height } = e.data;

    // Where in WASM memory we're going to place the incoming image.
    // Here we just use 0 for simplicity (at the very start of the memory).
    // In a more advanced setup, we might manage several buffers or offsets.
    const BUFFER_OFFSET = 0; // 1024

    // Make sure that the WASM memory is large enough to hold the incoming pixels.
    // If it's not, trying to write past the end would throw.
    if (BUFFER_OFFSET + length > memory.buffer.byteLength) {
        console.error('Not enough WASM memory for this buffer');
        return;
    }

    // Turn the incoming `ArrayBuffer` (from main thread) into a typed array,
    // so we can read its bytes.
    const input = new Uint8ClampedArray(buffer);


    // Create a view into the WASM linear memory at the chosen offset.
    // This is where we'll copy the image so the C code can work on it.
    const wasmView = new Uint8Array(memory.buffer, BUFFER_OFFSET, length);
    // Note: WASM exposes its memory as one big linear ArrayBuffer.
    // `wasmView` is thus a view — a typed array that looks directly into that specific region of WASM memory.


    // Copy JavaScript pixels into WASM memory.
    wasmView.set(input);

    // Now call the appropriate WASM-exported function.
    // These functions were compiled from the C code:
    //   - void transform1(unsigned char* data, int length);
    //   - void transform2(unsigned char* data, int length);
    //   - ...
    // We pass the offset (as a pointer) and the length.
    // Note: length = width * height * 4.
    if (type === 'transform1') {
        exports.transform1(BUFFER_OFFSET, length);
    } else if (type === 'transform2') {
        exports.transform2(BUFFER_OFFSET, length);
    } else if (type === 'transform3') {
        exports.transform3(BUFFER_OFFSET, length);
    } else if (type === 'transform4') {
        exports.transform4(BUFFER_OFFSET, length);
    } else {
        console.warn(`Unknown filter: ${type}`);
    }

    // At this point, WASM has modified the bytes IN PLACE in its memory.
    // "In place" means: it changes the data directly in its existing memory, rather than creating a new array.
    // We need to copy them back out to send them to the main thread.
    //
    // `wasmView.slice(0, length)` makes a copy of the processed bytes.
    const out = new Uint8ClampedArray(wasmView.slice(0, length));

    // Send the processed buffer back to the main thread.
    // Again, we TRANSFER the buffer ([out.buffer]) for performance.
    self.postMessage({type, activity: type, buffer: out.buffer, width, height }, [out.buffer]);
};

// Start loading WASM as soon as the worker starts.
initWasm().catch(err => console.error(err));
