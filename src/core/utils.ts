export function compareObjects(a : any, b : any) : boolean {
    if (Object.is(a, b)) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (typeof a !== 'object') {
        return Object.is(a, b);
    }
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) {
        return false;
    }
    for (let i = 0; i < ka.length; i++){
        const key = ka[i];
        if (!Object.prototype.hasOwnProperty.call(b, key)) {
            return false;
        }
        const va = a[key];
        const vb = b[key];
        if (!compareObjects(va, vb)) {
            return false;
        }
    }
    return true;
}

// Object.is polyfill
if (!Object.is) {
    Object.is = function(x, y) {
        // SameValue algorithm
        if (x === y) { // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    };
}
