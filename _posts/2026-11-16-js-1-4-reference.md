---
title: "1-4. 참조와 복사"
date: 2026-11-16 01:04:00 +0900
categories: [JS, 1. 값과 타입]
---

## 참조

참조는 객체가 메모리의 어디에 있는지를 가리키는 값이다. 객체를 변수에 넣으면 변수에는 객체 자체가 아니라 그 객체의 참조가 들어간다.

### 기본형을 담은 변수

변수에 값 자체가 들어 있다.

```javascript
const count = 1;        // count 에 1 이 들어 있다
```

### 객체를 담은 변수

변수에 참조가 들어 있다. 객체는 다른 곳에 있고, 변수는 그 위치를 가리킨다.

```javascript
const user = { name: '홍길동' };    // user 에 객체의 참조가 들어 있다
```

---

## 할당

변수에 다른 변수의 값을 넣으면 그 변수에 들어 있는 것이 복사된다.

### 기본형

값이 복사된다. 두 변수는 서로 관계가 없다.

```javascript
let a = 1;
let b = a;

b = 2;

console.log(a);     // 1
console.log(b);     // 2
```

### 객체

참조가 복사된다. 두 변수가 같은 객체를 가리킨다. 한쪽 변수로 객체의 내용을 바꾸면 다른 쪽 변수로 읽어도 바뀐 내용이 보인다.

```javascript
const a = { n: 1 };
const b = a;

b.n = 2;

console.log(a.n);       // 2
console.log(b.n);       // 2
console.log(a === b);   // true
```

배열도 객체이므로 같다.

```javascript
const a = [1];
const b = a;

b.push(2);

console.log(a);     // [1, 2]
```

### 재할당

변수에 다른 객체를 넣으면 그 변수만 새 객체를 가리킨다. 원래 객체와 다른 변수는 바뀌지 않는다.

```javascript
let a = { n: 1 };
let b = a;

b = { n: 2 };

console.log(a.n);       // 1
console.log(b.n);       // 2
console.log(a === b);   // false
```

---

## 인자 전달

함수를 호출할 때 인자로 넘긴 값은 매개변수에 할당된다. 할당의 규칙이 그대로 적용된다.

### 기본형

값이 복사된다. 함수 안에서 매개변수를 바꿔도 바깥 변수는 바뀌지 않는다.

```javascript
const change = (x) => {
    x = 2;
};

let a = 1;
change(a);

console.log(a);     // 1
```

### 객체

참조가 복사된다. 함수 안에서 객체의 내용을 바꾸면 바깥에서도 바뀐 내용이 보인다.

```javascript
const change = (obj) => {
    obj.n = 2;
};

const a = { n: 1 };
change(a);

console.log(a.n);   // 2
```

### 재할당

함수 안에서 매개변수에 다른 객체를 넣으면 매개변수만 새 객체를 가리킨다. 바깥 변수는 바뀌지 않는다.

```javascript
const change = (obj) => {
    obj = { n: 2 };
};

const a = { n: 1 };
change(a);

console.log(a.n);   // 1
```

---

## 비교

`===` 는 변수에 들어 있는 것을 비교한다.

### 기본형

값을 비교한다.

```javascript
console.log(1 === 1);       // true
console.log('a' === 'a');   // true
```

### 객체

참조를 비교한다. 같은 객체를 가리킬 때만 `true` 다. 내용이 같아도 따로 만든 객체는 참조가 다르다.

```javascript
const a = { n: 1 };
const b = { n: 1 };
const c = a;

console.log(a === b);   // false
console.log(a === c);   // true
```

---

## 얕은 복사

새 객체를 만들고 원본의 속성 값을 한 단계만 복사하는 것이다. 속성 값이 객체면 그 참조가 복사된다.

### 스프레드

`{ ...객체 }`, `[ ...배열 ]` 로 쓴다.

```javascript
const a = { n: 1, s: 'x' };
const b = { ...a };

b.n = 2;

console.log(a.n);       // 1
console.log(b.n);       // 2
console.log(a === b);   // false
```

```javascript
const a = [1, 2];
const b = [...a];

b.push(3);

console.log(a);     // [1, 2]
console.log(b);     // [1, 2, 3]
```

### Object.assign

`Object.assign(대상, 원본)` 은 원본의 속성을 대상 객체에 복사하고 대상 객체를 돌려준다. 대상에 빈 객체를 주면 얕은 복사가 된다.

```javascript
const a = { n: 1 };
const b = Object.assign({}, a);

b.n = 2;

console.log(a.n);   // 1
console.log(b.n);   // 2
```

### slice

배열의 `slice()` 는 인자 없이 호출하면 배열 전체를 얕은 복사한다.

```javascript
const a = [1, 2];
const b = a.slice();

b[0] = 9;

console.log(a);     // [1, 2]
console.log(b);     // [9, 2]
```

### 중첩된 객체

복사되지 않는다. 속성 값이 객체면 참조만 복사되므로, 원본과 복사본이 안쪽 객체를 함께 가리킨다.

```javascript
const a = { n: 1, sub: { m: 1 } };
const b = { ...a };

b.sub.m = 2;

console.log(a.sub.m);           // 2
console.log(a.sub === b.sub);   // true
```

객체가 들어 있는 배열도 같다. 배열은 새로 만들어지지만 안의 객체는 같은 객체다.

```javascript
const a = [{ n: 1 }];
const b = [...a];

b[0].n = 2;

console.log(a[0].n);        // 2
console.log(a === b);       // false
console.log(a[0] === b[0]); // true
```

---

## 깊은 복사

중첩된 객체까지 모두 새로 만들어 복사하는 것이다. 원본과 복사본이 어떤 객체도 함께 가리키지 않는다.

### JSON 변환

`JSON.parse(JSON.stringify(객체))` 로 쓴다. 객체를 JSON 문자열로 바꿨다가 다시 객체로 만든다.

```javascript
const a = { n: 1, sub: { m: 1 } };
const b = JSON.parse(JSON.stringify(a));

b.sub.m = 2;

console.log(a.sub.m);           // 1
console.log(b.sub.m);           // 2
console.log(a.sub === b.sub);   // false
```

### JSON 변환의 한계

JSON 으로 표현할 수 없는 값은 사라지거나 다른 값으로 바뀐다.

| 원본의 값 | 복사본 |
| --- | --- |
| `undefined` | 속성이 사라진다 |
| 함수 | 속성이 사라진다 |
| `NaN` | `null` |
| `Date` 객체 | 문자열 |

```javascript
const a = { u: undefined, f: () => 1, n: NaN, d: new Date(0), s: 'x' };
const b = JSON.parse(JSON.stringify(a));

console.log(b);     // { n: null, d: '1970-01-01T00:00:00.000Z', s: 'x' }
```

---

## 얕은 복사, 깊은 복사 비교

| | 얕은 복사 | 깊은 복사 |
| --- | --- | --- |
| 바깥 객체 | 새로 만든다 | 새로 만든다 |
| 중첩된 객체 | 원본과 함께 가리킨다 | 새로 만든다 |
| 방법 | 스프레드, `Object.assign`, `slice` | `JSON.parse(JSON.stringify())` |

---

## 불변 변경

원본 객체의 내용을 바꾸지 않고, 바뀐 내용을 가진 새 객체를 만드는 것이다.

### 객체의 속성 변경

스프레드로 복사한 뒤 바꿀 속성을 뒤에 적는다. 뒤에 적은 속성이 앞의 속성을 덮어쓴다.

```javascript
const a = { n: 1, s: 'x' };
const b = { ...a, n: 2 };

console.log(a);     // { n: 1, s: 'x' }
console.log(b);     // { n: 2, s: 'x' }
```

바꿀 속성을 앞에 적으면 스프레드가 덮어쓴다.

```javascript
const a = { n: 1, s: 'x' };
const b = { n: 2, ...a };

console.log(b);     // { n: 1, s: 'x' }
```

### 중첩된 객체의 속성 변경

바꿀 속성까지 가는 경로의 객체를 모두 스프레드로 새로 만든다.

```javascript
const a = { n: 1, sub: { m: 1, k: 1 } };
const b = { ...a, sub: { ...a.sub, m: 2 } };

console.log(a.sub);             // { m: 1, k: 1 }
console.log(b.sub);             // { m: 2, k: 1 }
console.log(a.sub === b.sub);   // false
```

### 배열에 요소 추가

스프레드로 펼치고 앞이나 뒤에 요소를 적는다.

```javascript
const a = [1, 2];

console.log([...a, 3]);     // [1, 2, 3]
console.log([0, ...a]);     // [0, 1, 2]
console.log(a);             // [1, 2]
```

### 배열의 요소 변경

`map` 으로 새 배열을 만들면서, 바꿀 요소만 새 객체로 바꾼다. 바꾸지 않은 요소는 원본과 같은 객체다.

```javascript
const a = [{ id: 1, qty: 1 }, { id: 2, qty: 1 }];
const b = a.map((row) => (row.id === 2 ? { ...row, qty: 5 } : row));

console.log(a[1].qty);      // 1
console.log(b[1].qty);      // 5
console.log(a[0] === b[0]); // true
console.log(a[1] === b[1]); // false
```

### 배열의 요소 삭제

`filter` 로 남길 요소만 골라 새 배열을 만든다.

```javascript
const a = [1, 2, 3];
const b = a.filter((v) => v !== 2);

console.log(a);     // [1, 2, 3]
console.log(b);     // [1, 3]
```

---

## Object.freeze

객체의 내용을 바꿀 수 없게 만드는 함수다. 속성의 값 변경, 추가, 삭제가 모두 막힌다.

### 변경 시도

엄격 모드에서는 에러가 나고, 엄격 모드가 아닐 때는 에러 없이 무시된다.

```javascript
const a = Object.freeze({ n: 1 });

a.n = 2;    // TypeError: Cannot assign to read only property 'n' of object '#<Object>'
```

### 중첩된 객체

막히지 않는다. 한 단계만 얼린다.

```javascript
const a = Object.freeze({ sub: { m: 1 } });

a.sub.m = 2;

console.log(a.sub.m);   // 2
```

---

## 정리

- 참조: 객체의 위치를 가리키는 값. 객체를 담은 변수에는 참조가 들어 있다.
- 할당: 변수에 들어 있는 것을 복사한다. 기본형은 값이, 객체는 참조가 복사된다.
- 인자 전달: 할당과 같다. 함수 안에서 객체의 내용을 바꾸면 바깥에서도 보인다.
- 비교: `===` 는 기본형은 값을, 객체는 참조를 비교한다.
- 얕은 복사: 속성을 한 단계만 복사한다. 중첩된 객체는 원본과 함께 가리킨다.
- 깊은 복사: 중첩된 객체까지 새로 만든다.
- 불변 변경: 원본을 바꾸지 않고 바뀐 내용을 가진 새 객체를 만든다.
- `Object.freeze`: 객체의 내용을 바꿀 수 없게 만든다. 한 단계만 적용된다.
