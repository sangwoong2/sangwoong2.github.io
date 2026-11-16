---
title: "3-2. 구조분해와 스프레드"
date: 2026-11-16 13:20:00 +0900
categories: [JS, 3. 데이터 다루기]
---

## 구조분해

객체나 배열에서 값을 꺼내 변수에 담는 문법이다.

### 객체

속성 이름으로 꺼낸다. 없는 속성은 `undefined` 다.

```javascript
const user = { name: '홍길동', age: 30 };
const { name, dept } = user;

console.log(name);      // '홍길동'
console.log(dept);      // undefined
```

### 배열

순서로 꺼낸다. 자리를 비우면 그 요소를 건너뛴다.

```javascript
const [year, month] = '2026-11'.split('-');
const [first, , third] = [1, 2, 3];

console.log(year, month);       // '2026' '11'
console.log(first, third);      // 1 3
```

### 이름 바꾸기

`{ 속성: 변수 }` 로 쓴다. 콜론 왼쪽이 꺼낼 속성, 오른쪽이 담을 변수다.

```javascript
const user = { name: '홍길동' };
const { name: userName } = user;

console.log(userName);      // '홍길동'
```

### 기본값

꺼낸 값이 `undefined` 일 때만 적용된다. `null` 에는 적용되지 않는다.

```javascript
const row = { qty: null, price: undefined };
const { qty = 0, price = 0, amt = 0 } = row;

console.log(qty);       // null
console.log(price);     // 0
console.log(amt);       // 0
```

### 중첩

안쪽 객체의 속성을 한 번에 꺼낸다. 안쪽 객체가 없으면 에러가 난다.

```javascript
const data = { user: { name: '홍길동' } };
const { user: { name } } = data;

console.log(name);      // '홍길동'
```

```javascript
const data = {};
const { user: { name } } = data;    // TypeError: Cannot read properties of undefined (reading 'name')
```

### null, undefined

`null` 이나 `undefined` 를 구조분해하면 에러가 난다.

```javascript
const { a } = null;     // TypeError: Cannot destructure property 'a' of 'null' as it is null.
const [b] = null;       // TypeError: null is not iterable
```

### 매개변수

매개변수 자리에서 바로 구조분해할 수 있다. 인자를 넘기지 않으면 `undefined` 를 구조분해하게 되어 에러가 난다. 매개변수에 기본값 `{}` 를 주면 막을 수 있다.

```javascript
const show = ({ name }) => name;

console.log(show({ name: '홍길동' }));  // '홍길동'
console.log(show());                    // TypeError: Cannot destructure property 'name' of 'undefined' as it is undefined.
```

```javascript
const show = ({ name } = {}) => name;

console.log(show());    // undefined
```

---

## 스프레드

`...` 를 값 앞에 붙여 그 안의 내용을 펼치는 문법이다.

### 쓰는 자리

| 자리 | 예 | 결과 |
| --- | --- | --- |
| 배열 안 | `[...a, 3]` | `a` 의 요소를 펼친 새 배열 |
| 객체 안 | `{ ...o, b: 2 }` | `o` 의 속성을 펼친 새 객체 |
| 함수 호출 | `f(...args)` | 배열의 요소를 인자로 하나씩 넘긴다 |

### 순서

객체에서 같은 키가 겹치면 뒤에 적은 것이 남는다.

```javascript
const o = { a: 1, b: 1 };

console.log({ ...o, b: 2 });    // { a: 1, b: 2 }
console.log({ b: 2, ...o });    // { b: 1, a: 1 }
```

### null, undefined

객체 안에서는 무시된다. 배열 안에서는 에러가 난다.

```javascript
console.log({ ...null, a: 1 });     // { a: 1 }
console.log([...null]);             // TypeError: null is not iterable
```

### 복사의 깊이

한 단계만 복사한다. 안쪽 객체는 원본과 함께 가리킨다. 1-4 "참조와 복사"의 얕은 복사다.

---

## 나머지

`...` 를 변수 앞에 붙여 남은 것을 한 변수에 모으는 문법이다. 스프레드와 기호가 같지만, 값을 받는 자리에 쓴다.

### 구조분해

꺼내고 남은 속성이나 요소가 모인다.

```javascript
const { a, ...others } = { a: 1, b: 2, c: 3 };
const [first, ...rest] = [1, 2, 3];

console.log(others);    // { b: 2, c: 3 }
console.log(rest);      // [2, 3]
```

### 매개변수

앞의 매개변수에 들어가고 남은 인자가 배열로 모인다. 남은 것이 없으면 빈 배열이다.

```javascript
const f = (first, ...rest) => rest;

console.log(f(1, 2, 3));    // [2, 3]
console.log(f(1));          // []
```

---

## 스프레드, 나머지 비교

| | 스프레드 | 나머지 |
| --- | --- | --- |
| 하는 일 | 펼친다 | 모은다 |
| 쓰는 자리 | 값을 만드는 자리 | 값을 받는 자리 |
| 예 | `const b = [...a];` | `const [x, ...b] = a;` |

---

## 매개변수 기본값

매개변수에 `= 값` 을 붙이면 인자가 `undefined` 일 때 그 값이 들어간다. `null` 에는 적용되지 않는다.

```javascript
const f = (a, b = 2) => [a, b];

console.log(f(1));              // [1, 2]
console.log(f(1, undefined));   // [1, 2]
console.log(f(1, null));        // [1, null]
```

---

## 정리

- 구조분해: 객체는 이름으로, 배열은 순서로 값을 꺼내 변수에 담는다.
- 기본값: `undefined` 일 때만 적용된다. `null` 은 그대로 들어온다.
- `null`, `undefined` 를 구조분해하면 에러가 난다. 매개변수는 `= {}` 로 막는다.
- 스프레드: `...` 로 배열이나 객체를 펼친다. 객체는 뒤에 적은 속성이 남는다.
- 나머지: `...` 로 남은 것을 모은다. 값을 받는 자리에 쓴다.
