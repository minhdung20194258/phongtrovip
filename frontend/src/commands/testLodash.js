import pkg from 'lodash';

const {filter, keys, union} = pkg;

const o1 = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 4};
const o2 = {a: 1, b: 2, c: 33, d: 4, e: 5, f: 45};

const keyUnion = union(keys(o1), keys(o2));
console.log(
  filter(keyUnion, function (key) {
    return o1[key] !== o2[key];
  }),
);
