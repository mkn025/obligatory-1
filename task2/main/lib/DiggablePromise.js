
export default class DiggablePromise {
    /**
     * @param onDig: Function returning the value the promise should resolve with when ``dig`` is called
     */
    constructor(onDig) {
        let { promise, resolve, reject } = Promise.withResolvers();
        [this._promise, this.resolve, this.reject] = [promise, resolve, reject];
        if (onDig) {
            this._fetchValue = onDig;
        }
    }
    get promise() {
        return this._promise;
    }



    /**
     * Method to chain a promise with fulfill- and reject-reactions.
     *
     * @param onFulfilled: The function called when the promise ``then`` is called on gets resolved. Returns the value the new promise gets resolved with.
     * @param onRejected: An optional function to handle rejections. The function called when the promise ``then`` is called on is rejected. Returns the value the new promise gets rejected with.
     * @returns a new promise dependent on the promise ``then``was called on
     */
    then(onFulfilled, onRejected) {
        let newPromise = new DiggablePromise();
        newPromise._setSourcePromise(this);
        this._promise.then(
            (x) => {

                let ffv = onFulfilled ? onFulfilled(x) : x;

                if (ffv instanceof DiggablePromise) {
                    ffv.then(
                        (v) => newPromise.resolve(v),
                        (e) => newPromise.reject(e)
                    );
                } else {
                    newPromise.resolve(ffv);
                }
            },
            (y) => {
                if (onRejected) {
                    let rjv = onRejected(y);

                    if (rjv instanceof DiggablePromise) {
                        rjv.then(
                            (v) => newPromise.resolve(v),
                            (e) => newPromise.reject(e)
                        );
                    } else {
                        newPromise.resolve(rjv);
                    }
                } else {
                    newPromise.reject(y);
                }
            }
        );
        return newPromise;
    }

    /**
     * Method used to "catch" an error, normally at the end of a promise chain
     *
     * @param onRejected the function to handle a value sent from a rejected promise
     * @returns a new pending promise
     */
    catch(onRejected) {

        return this.then(undefined, onRejected);
    }


    /**
     * Method to schedule a function to be called when a promise is settled
     *
     * @param onFinally: A function executed when the promise settles
     * @returns a new pending promise, to be settled with the same value as the current promise
     */
    finally(onFinally) {

        if (typeof onFinally != "function") {
            return this.then(onFinally, onFinally);
        } else {
            return this.then(
                (value) => DiggablePromise.resolve(onFinally()).then(() => value),
                (reason) =>
                    DiggablePromise.resolve(onFinally()).then(() => {
                        throw reason;
                    })
            );
        }
    }

    /**
     * Method to dig promise chain, will resolve promise with ``onDig`` function, or call itself recursively on the source promise.
     * If this._fetchValue is undefined, this function should call itself recursively on all source promises (if there is a source promise). 
     */
    dig() {
        if (this._fetchValue == undefined) {
            if (this._sourcePromise) {
                this._sourcePromise.forEach((p) => p.dig());
            }
        } else {
            this.resolve(this._fetchValue());
        }
    }

    /**
     * Method to set source promise(s) of new promise.
     *
     * @param sourcePromise: The preceding promise in a promise chain
     */
    _setSourcePromise(sourcePromise) {
        this._sourcePromise = [sourcePromise];
    }

    /**
     * Method to add new source promises to existing source promises.
     *
     * @param sourcePromise
     */
    _setSourcePromises(sourcePromise) {
        if (!this._sourcePromise) {
            this._sourcePromise = sourcePromise;
        } else {
            this._sourcePromise = this._sourcePromise.concat(sourcePromise);
        }
    }


    /**
     * Method to resolve a promise with the values of several promises once they are resolved.
     *
     * @param promiseList: A list of diggable promises.
     * @returns a new promise either resolved with a list of the promiseList's resolved values, or a promise rejected with the first promise of promiseList that got rejected.
     */
    static all(promiseList) {
        let counter = promiseList.length;
        let arr = [];
        let promise = new DiggablePromise();
        promise._setSourcePromises(promiseList);

        for (let i = 0; i < counter; i++) {
            promiseList[i].then(
                (v) => {
                    arr[i] = v;
                    counter -= 1;
                    if (counter == 0) {
                        promise.resolve(arr);
                    }
                },
                (e) => promise.reject(e)
            )
        }
        return promise;
    }

    /**
     * Method to create a promise settled with the value of the first promise of a list of promises to settle.
     *
     * @param promiseList: A list of diggable promises.
     * @returns a promise settled with the value of the first promise to settle.
     */
    static race(promiseList) {
        let promise = new DiggablePromise();
        promise._setSourcePromises(promiseList);
        promiseList.forEach((p) =>
            p.then(
                (v) => promise.resolve(v),
                (e) => promise.reject(e)
            )
        );
        return promise;
    }


    /**
     * Method to create a promise fulfilled with the value of the first promise of a list of promises to get resolved.
     *
     * @param promiseList: A list of diggable promises.
     * @returns a promise either resolved with the value of the first promise to resolve, or rejected with a list of values from the rejected promises.
     *          using AggregateError
     */
    static any(promiseList) {
        let promise = new DiggablePromise();
        let rejects = [];
        let counter = promiseList.length;
        promise._setSourcePromises(promiseList);
        promiseList.forEach((p, index) =>
            // TODO
            p.then(
                (v) => promise.resolve(v),
                (e) => {
                    rejects[index] = e;
                    counter -= 1;
                    if (counter == 0) {
                        promise.reject(new AggregateError(rejects, "All promises was rejected."));
                    }
                }
            )
        );
        return promise;
    }

    /**
     * Method to create a new resolved promise.
     *
     * @param value to resolve the new promise with.
     * @returns a promise resolved with the value, or if value is a diggable promise, we return the value.
     */
    static resolve(value) {
        if (value instanceof DiggablePromise) {
            return value;
        }
        let promise = new DiggablePromise();
        promise.resolve(value);
        return promise;
    }

    /**
     * Method to create a new rejected promise.
     *
     * @param value to reject the new promise with.
     * @returns a promise rejected with the value passed as an argument.
     */
    static reject(value) {
        let promise = new DiggablePromise();
        promise.reject(value);
        return promise;
    }
}
