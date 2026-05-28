function assert(value, message) {
    if (!value) throw new Error(message || 'Assertion failed');
}
assert.equal = (actual, expected, message) => {
    if (actual !== expected) throw new Error(message || `Expected ${expected} but got ${actual}`);
};
assert.isTrue = (value, message) => { assert(value === true, message); };
assert.isFalse = (value, message) => { assert(value === false, message); };
assert.isArray = (value, message) => { assert(Array.isArray(value), message); };
assert.isObject = (value, message) => { assert(value !== null && typeof value === 'object' && !Array.isArray(value), message); };
assert.include = (haystack, needle, message) => {
    assert(typeof haystack === 'string' ? haystack.includes(needle) : false, message);
};
assert.deepInclude = (haystack, needle, message) => {
    if (Array.isArray(haystack)) {
        const found = haystack.some(item => JSON.stringify(item) === JSON.stringify(needle));
        assert(found, message);
    } else {
        assert(JSON.stringify(haystack).includes(JSON.stringify(needle)), message);
    }
};
assert.deepEqual = (actual, expected, message) => {
    assert(JSON.stringify(actual) === JSON.stringify(expected), message || `Expected deep equal`);
};
assert.isDefined = (value, message) => { assert(value !== undefined, message); };
assert.isNumber = (value, message) => { assert(typeof value === 'number', message); };
assert.isNull = (value, message) => { assert(value === null, message); };
assert.containsAllKeys = (obj, keys, message) => {
    const missing = keys.filter(k => !(k in obj));
    assert(missing.length === 0, message || `Missing keys: ${missing.join(', ')}`);
};
assert.sameDeepMembers = (arr1, arr2, message) => {
    const s1 = arr1.map(i => JSON.stringify(i)).sort();
    const s2 = arr2.map(i => JSON.stringify(i)).sort();
    assert(JSON.stringify(s1) === JSON.stringify(s2), message || 'Arrays do not have same deep members');
};

export { assert };
