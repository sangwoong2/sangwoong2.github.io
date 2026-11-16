---
title: "3-4. Map, Set, JSON"
date: 2026-11-16 13:40:00 +0900
categories: [JS, 3. 데이터 다루기]
---

## Map

키와 값의 쌍을 담는 객체다. `set` 으로 넣고 `get` 으로 꺼낸다.

```javascript
const m = new Map();
m.set('a', 1);

console.log(m.get('a'));    // 1
console.log(m.get('z'));    // undefined
console.log(m.has('a'));    // true
console.log(m.size);        // 1
```

### 객체와의 차이

| | 객체 | Map |
| --- | --- | --- |
| 키의 타입 | 문자열 | 아무 값 |
| 읽기 | `o.a`, `o['a']` | `m.get('a')` |
| 쓰기 | `o.a = 1` | `m.set('a', 1)` |
| 개수 | `Object.keys(o).length` | `m.size` |
| 순서 | 정수 키가 먼저 | 넣은 순서 |
| JSON 변환 | 된다 | `'{}'` 가 된다 |

### 키의 구분

키를 문자열로 바꾸지 않는다. `1` 과 `'1'` 은 다른 키다.

```javascript
const m = new Map();
m.set(1, '숫자');
m.set('1', '문자열');

console.log(m.get(1));      // '숫자'
console.log(m.get('1'));    // '문자열'
console.log(m.size);        // 2
```

객체를 키로 쓰면 참조로 구분한다.

```javascript
const m = new Map();
const key = { id: 1 };
m.set(key, 'x');

console.log(m.get(key));        // 'x'
console.log(m.get({ id: 1 }));  // undefined
```

### 점 접근

`m.a` 로는 읽을 수 없다. 에러 없이 `undefined` 가 나온다.

```javascript
const m = new Map([['a', 1]]);

console.log(m.a);           // undefined
console.log(m.get('a'));    // 1
```

### JSON 변환

`JSON.stringify` 에 그대로 넘기면 내용이 사라진다. 객체로 바꾼 뒤 넘긴다.

```javascript
const m = new Map([['a', 1]]);

console.log(JSON.stringify(m));                         // '{}'
console.log(JSON.stringify(Object.fromEntries(m)));     // '{"a":1}'
```

---

## Set

중복 없이 값을 담는 객체다. `add` 로 넣고 `has` 로 확인한다.

```javascript
const s = new Set();
s.add(1);
s.add(1);

console.log(s.has(1));  // true
console.log(s.size);    // 1
```

### 중복 제거

배열로 Set 을 만든 뒤 다시 배열로 펼친다.

```javascript
console.log([...new Set(['a', 'b', 'a'])]);     // ['a', 'b']
```

### 객체

참조로 구분한다. 내용이 같아도 따로 만든 객체는 다른 값이다.

```javascript
console.log(new Set([{ id: 1 }, { id: 1 }]).size);  // 2
```

### 인덱스 접근

할 수 없다. 에러 없이 `undefined` 가 나온다. 배열로 바꾼 뒤 접근한다.

```javascript
const s = new Set([1]);

console.log(s[0]);          // undefined
console.log([...s][0]);     // 1
```

---

## JSON

데이터를 문자열로 나타내는 형식이다. `JSON.stringify` 는 값을 JSON 문자열로 바꾸고, `JSON.parse` 는 JSON 문자열을 값으로 바꾼다.

```javascript
const text = JSON.stringify({ a: 1, b: [1, 2], c: null });

console.log(text);                  // '{"a":1,"b":[1,2],"c":null}'
console.log(JSON.parse(text).a);    // 1
```

### stringify 에서 바뀌는 값

JSON 으로 나타낼 수 없는 값은 사라지거나 다른 값이 된다. 에러가 나지 않는다.

| 값 | 객체의 속성일 때 | 배열의 요소일 때 |
| --- | --- | --- |
| `undefined` | 속성이 사라진다 | `null` |
| 함수 | 속성이 사라진다 | `null` |
| `NaN` | `null` | `null` |
| Date 객체 | 문자열 | 문자열 |
| Map, Set | `{}` | `{}` |

```javascript
console.log(JSON.stringify({ a: undefined, f: () => 1 }));  // '{}'
console.log(JSON.stringify([undefined, () => 1, NaN]));     // '[null,null,null]'
```

### stringify 의 결과가 문자열이 아닌 경우

`undefined` 를 넘기면 문자열이 아니라 `undefined` 가 나온다.

```javascript
console.log(JSON.stringify(undefined));     // undefined
console.log(JSON.stringify(null));          // 'null'
```

### 순환 참조

객체가 자기 자신을 가리키면 에러가 난다.

```javascript
const a = {};
a.self = a;

JSON.stringify(a);      // TypeError: Converting circular structure to JSON
```

### parse 의 실패

JSON 형식이 아닌 문자열을 넘기면 에러가 난다. JSON 은 키와 문자열을 큰따옴표로 감싸야 한다.

| 넘긴 값 | 결과 |
| --- | --- |
| `'{"a":1}'` | `{ a: 1 }` |
| `''` | SyntaxError: Unexpected end of JSON input |
| `'{a:1}'` | SyntaxError: Unexpected token a in JSON at position 1 |
| `"{'a':1}"` | SyntaxError: Unexpected token ' in JSON at position 1 |
| `undefined` | SyntaxError: Unexpected token u in JSON at position 0 |

---

## 정리

- Map: 키와 값의 쌍. 키를 문자열로 바꾸지 않는다. `get`, `set` 으로 접근한다.
- Set: 중복 없는 값의 모음. 객체는 참조로 구분한다.
- Map, Set: 점이나 인덱스로 접근하면 `undefined` 다. `JSON.stringify` 하면 `'{}'` 가 된다.
- `JSON.stringify`: `undefined` 와 함수는 사라지고, `NaN` 은 `null` 이 된다.
- `JSON.parse`: JSON 형식이 아니면 SyntaxError 가 난다. 빈 문자열과 `undefined` 도 해당한다.
