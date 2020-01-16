export function stringSplice(str: string, index: number, count: number, add: string = "") {
    return str.slice(0, index) + add + str.slice(index + count);
};

export function arraySum(arr: number[]): number {
    let sum = 0;

    for (const num of arr) {
        sum += num;
    }

    return sum;
};

export function arrayKeysWithSearch<T>(arr: T[], search: T, strict: boolean = false): number[] {
    const arrKeys = [];

    for (const [key, val] of arr.entries()) {
        const check = strict === true ? val === search : val == search;
        if (check === true) {
            arrKeys.push(key);
        }
    }

    return arrKeys;
};

interface GenericObj<T> {
    [key: string]: T;
}

export function objectKeysWithSearch<T>(obj: GenericObj<T>, search: T, strict: boolean = false): Array<keyof GenericObj<T>> {
    const objKeys = [];

    for (const [key, val] of Object.entries(obj)) {
        const check = strict === true ? val === search : val == search;
        if (check === true) {
            objKeys.push(key);
        }
    }

    return objKeys;
};
