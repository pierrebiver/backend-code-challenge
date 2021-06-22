import {Transform } from "stream";

let firstPush = true;
export const toJsonArrayTransform = new Transform({

    transform(chunk, encoding, callback) {
        if (firstPush) {
            this.push("[");
            firstPush = false;
        }
        this.push(chunk);
        callback();
    },
    flush(callback) {
        this.push(']');
        callback();
    }
});