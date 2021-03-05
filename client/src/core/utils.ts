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

export function beautyMoneyValue(balance : number) : string {
    const minus = (balance < 0) ? '-' : '';
    balance = Math.abs(balance);
    const parts = balance.toFixed(2).split('.');
    const len = parts[0].length;
    const mas = [''];
    for (let i = 0; i < len; i++) {
        if ((len - i) % 3 === 0) {
            mas.push('');
        }
        mas[mas.length - 1] += parts[0][i];
    }
    return minus + (mas.join(' ') + '.' + parts[1]).trim();
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
