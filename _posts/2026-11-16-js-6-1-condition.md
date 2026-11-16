---
title: "6-1. 조건과 분기"
date: 2026-11-16 06:01:00 +0900
categories: [JS, 6. 흐름 제어와 에러 처리]
---

## if

조건이 참 같은 값이면 블록을 실행하는 문장이다. 조건 자리의 값은 불리언으로 변환된다.

### 조건의 변환

불리언이 아닌 값도 조건이 된다. 1-3 "없는 값 다루기"의 규칙을 따른다.

```javascript
const check = (v) => (v ? '참' : '거짓');

console.log(check(0));      // '거짓'
console.log(check(''));     // '거짓'
console.log(check('0'));    // '참'
console.log(check([]));     // '참'
```

### 조건 안의 할당

조건 자리에 `=` 를 쓰면 비교가 아니라 할당이다. 할당한 값이 조건이 된다. 에러가 나지 않는다.

```javascript
let step = '2';

if (step = '1') {
    console.log(step);      // '1'  (step 이 바뀌었고 조건은 참이다)
}
```

### 중괄호 생략

`{ }` 를 생략하면 바로 다음 문장 하나만 `if` 에 속한다.

```javascript
const result = [];

if (false)
    result.push('a');
    result.push('b');   // 들여쓰기와 관계없이 항상 실행된다

console.log(result);    // ['b']
```

### else if 의 순서

위에서부터 차례로 검사하고, 처음 참인 것만 실행한다. 범위가 넓은 조건이 위에 있으면 아래 조건에 도달하지 못한다.

```javascript
const grade = (n) => {
    if (n > 5) return 'A';
    else if (n > 10) return 'B';    // 도달하지 못한다
    return 'C';
};

console.log(grade(15));     // 'A'
```

---

## 삼항 연산자

`조건 ? 값1 : 값2` 다. 조건이 참 같은 값이면 값1, 아니면 값2 가 된다. `if` 는 문장이고 삼항 연산자는 식이라서, 값이 들어갈 자리에 쓸 수 있다.

```javascript
const count = 5;
const label = count > 3 ? '많음' : '적음';

console.log(label);     // '많음'
```

### 중첩

뒤쪽 값 자리에 다시 삼항 연산자를 쓸 수 있다. 앞에서부터 차례로 검사한다.

```javascript
const n = 5;
const level = n > 10 ? 'A' : n > 3 ? 'B' : 'C';

console.log(level);     // 'B'
```

---

## switch

값 하나를 여러 `case` 와 비교해서 일치하는 곳부터 실행하는 문장이다.

### 비교 방식

`===` 로 비교한다. 타입이 다르면 일치하지 않는다.

```javascript
const type = (v) => {
    switch (v) {
        case 1: return '숫자 1';
        case '1': return '문자열 1';
        default: return '없음';
    }
};

console.log(type(1));       // '숫자 1'
console.log(type('1'));     // '문자열 1'
console.log(type(2));       // '없음'
```

### break

일치한 `case` 부터 아래로 계속 실행한다. `break` 나 `return` 을 만나야 멈춘다.

```javascript
const result = [];

switch (1) {
    case 1:
        result.push('one');     // break 가 없다
    case 2:
        result.push('two');
        break;
    case 3:
        result.push('three');
}

console.log(result);    // ['one', 'two']
```

### case 묶기

`break` 없이 아래로 이어지는 성질을 이용해 여러 값을 한 번에 처리한다.

```javascript
const needLogin = (step) => {
    switch (step) {
        case '1':
        case '4':
            return true;
        default:
            return false;
    }
};

console.log(needLogin('4'));    // true
console.log(needLogin('2'));    // false
```

---

## if, 삼항 연산자, switch 비교

| | `if` | 삼항 연산자 | `switch` |
| --- | --- | --- | --- |
| 종류 | 문장 | 식 | 문장 |
| 값이 들어갈 자리에 | 쓸 수 없다 | 쓸 수 있다 | 쓸 수 없다 |
| 조건 | 아무 식 | 아무 식 | 값 하나를 `===` 로 비교 |

---

## 조기 반환

함수의 앞부분에서 조건에 맞지 않는 경우를 먼저 `return` 으로 끝내는 방식이다. 그 아래의 코드는 조건을 통과한 경우만 실행된다.

```javascript
const count = (rows) => {
    if (!rows || rows.length === 0) return 0;

    return rows.length;
};

console.log(count(null));   // 0
console.log(count([]));     // 0
console.log(count([1]));    // 1
```

---

## 객체로 분기

값에 따라 다른 값을 고를 때, 객체에 미리 넣어 두고 키로 꺼낸다. 없는 키는 `undefined` 다.

```javascript
const TITLE = { 1: '게시판', 2: '견적관리' };

console.log(TITLE[1]);              // '게시판'
console.log(TITLE[9]);              // undefined
console.log(TITLE[9] ?? '없음');    // '없음'
```

---

## 정리

- `if`: 조건이 불리언으로 변환된다. 조건 자리의 `=` 는 할당이다.
- `{ }` 를 생략하면 다음 문장 하나만 `if` 에 속한다.
- 삼항 연산자: 식이라서 값이 들어갈 자리에 쓸 수 있다.
- `switch`: `===` 로 비교하고, `break` 가 없으면 아래 `case` 로 계속 실행한다.
- 조기 반환: 조건에 맞지 않는 경우를 함수 앞부분에서 먼저 끝낸다.
