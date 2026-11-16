---
title: "[JS 기본 1] 변수 선언"
date: 2026-11-16 12:00:00 +0900
categories: [JavaScript 기본편, 1부 값과 타입]
tags: [javascript]
---

## 변수

변수는 값에 붙인 이름이다. 값을 메모리 어딘가에 두고, 그 위치를 이름으로 가리킨다.

### 선언, 초기화, 할당

변수를 다루는 동작은 세 가지로 나뉜다.

| 동작 | 하는 일 |
| --- | --- |
| 선언 | 이름을 만든다 |
| 초기화 | 처음 값을 넣는다 |
| 할당 | 이름이 가리키는 값을 바꾼다 |

```javascript
let count;      // 선언
count = 1;      // 할당
let total = 0;  // 선언과 초기화
```

### 선언 키워드

변수를 선언하는 키워드는 `const`, `let`, `var` 세 가지다.

```javascript
const name = '홍길동';
let count = 0;
var total = 0;
```

### 타입

변수를 선언할 때 타입을 적지 않는다. 타입은 변수가 아니라 값이 갖고 있다. 한 변수에 숫자를 넣었다가 문자열을 넣을 수 있다.

```javascript
let value = 10;
value = '열';
```

---

## 스코프

스코프는 변수를 쓸 수 있는 범위다. 변수를 어디에, 어떤 키워드로 선언했는지에 따라 정해진다.

### 블록 스코프

`{ }` 로 감싼 범위다. `if`, `for`, 함수의 `{ }` 가 모두 블록이다. `const` 와 `let` 변수는 선언한 블록 안에서만 쓸 수 있다.

```javascript
if (true) {
    const inside = 1;
    console.log(inside);    // 1
}
console.log(inside);        // ReferenceError: inside is not defined
```

### 함수 스코프

함수의 `{ }` 범위다. `var` 변수는 블록이 아니라 선언한 함수 안에서 쓸 수 있다.

```javascript
function calc() {
    if (true) {
        var result = 10;
    }
    console.log(result);    // 10
}
console.log(result);        // ReferenceError: result is not defined
```

### 모듈 스코프

파일 하나의 범위다. 어떤 `{ }` 에도 들어 있지 않은 자리에 선언한 변수는 그 파일 전체에서 쓸 수 있고, 다른 파일에서는 쓸 수 없다.

```javascript
const PAGE_SIZE = 50;

function getPage(rows) {
    return rows.slice(0, PAGE_SIZE);
}
```

### 스코프 중첩

스코프 안에 스코프가 들어갈 수 있다. 안쪽 스코프에서는 바깥 스코프의 변수를 쓸 수 있고, 바깥 스코프에서는 안쪽 스코프의 변수를 쓸 수 없다.

```javascript
const outer = '바깥';

function show() {
    const inner = '안쪽';
    console.log(outer);     // 바깥
    console.log(inner);     // 안쪽
}

console.log(inner);         // ReferenceError: inner is not defined
```

### 스코프 단위

변수의 스코프는 선언한 자리를 감싸는 범위 중 하나로 정해진다. 어떤 범위를 기준으로 삼는지가 키워드마다 다르고, 이것을 스코프 단위라고 한다.

| 키워드 | 스코프 단위 | 변수의 스코프 |
| --- | --- | --- |
| `const`, `let` | 블록 | 선언을 감싸는 가장 가까운 블록. 감싸는 블록이 없으면 모듈 |
| `var` | 함수 | 선언을 감싸는 가장 가까운 함수. 감싸는 함수가 없으면 모듈 |

"블록 스코프"는 블록 안에서만 선언할 수 있다는 뜻이 아니다. 어디에 선언하든 가장 가까운 블록을 기준으로 스코프가 정해진다는 뜻이다.

```javascript
const a = 1;            // 감싸는 블록이 없다 → 모듈 스코프

function show() {
    const b = 2;        // 함수의 { } 가 스코프

    if (true) {
        const c = 3;    // if 의 { } 가 스코프
        var d = 4;      // if 의 { } 는 건너뛰고 함수 show 가 스코프
    }

    console.log(d);     // 4
    console.log(c);     // ReferenceError: c is not defined
}
```

### 섀도잉

안쪽 스코프에서 바깥 스코프와 같은 이름의 변수를 선언하는 것이다. 안쪽 변수가 바깥 변수를 가린다. 바깥 변수는 바뀌지 않는다.

```javascript
const name = '바깥';

function show() {
    const name = '안쪽';
    console.log(name);      // 안쪽
}

show();
console.log(name);          // 바깥
```

---

## const

다시 할당할 수 없는 변수를 선언한다.

### 재할당

할 수 없다.

```javascript
const count = 1;
count = 2;      // TypeError: Assignment to constant variable.
```

### 초기값

필수다. 다시 할당할 수 없으므로 선언할 때 값을 넣어야 한다.

```javascript
const a;        // SyntaxError: Missing initializer in const declaration
```

### 스코프

스코프 단위가 블록이다.

### 선언 전 사용

할 수 없다. 블록이 시작될 때 그 안에서 선언된 변수 이름이 미리 등록되지만, 선언한 줄이 실행되기 전까지는 쓸 수 없는 상태로 있다. 블록의 시작부터 선언한 줄까지의 구간을 일시적 사각지대(TDZ, Temporal Dead Zone)라고 한다.

```javascript
console.log(count);     // ReferenceError: Cannot access 'count' before initialization
const count = 1;
```

에러 메시지가 `is not defined` 가 아니라 `before initialization` 이다. 변수가 없는 것이 아니라 아직 초기화되지 않았다는 뜻이다.

바깥에 같은 이름의 변수가 있어도 결과는 같다. 함수가 시작될 때 안쪽 `name` 이 이미 등록되었기 때문에 바깥 `name` 을 읽지 않는다.

```javascript
const name = '바깥';

function show() {
    console.log(name);  // ReferenceError: Cannot access 'name' before initialization
    const name = '안쪽';
}
```

### 재선언

할 수 없다. 같은 스코프에서 같은 이름을 다시 선언하면 에러가 난다.

```javascript
const a = 1;
const a = 2;    // SyntaxError: Identifier 'a' has already been declared
```

### 내용 변경

할 수 있다. `const` 가 막는 것은 재할당, 즉 변수가 다른 값을 가리키게 하는 것이다. 변수가 가리키는 객체나 배열의 내용을 바꾸는 것은 재할당이 아니다.

```javascript
const user = { name: '홍길동' };

user.name = '김철수';       // 가능: 객체의 내용 변경
user.age = 30;              // 가능: 속성 추가
user = { name: '이영희' };  // TypeError: 재할당
```

```javascript
const rows = [];

rows.push(1);               // 가능: 배열의 내용 변경
rows = [1];                 // TypeError: 재할당
```

---

## let

다시 할당할 수 있는 변수를 선언한다.

### 재할당

할 수 있다.

```javascript
let total = 0;
total = 100;
total += 50;
console.log(total);     // 150
```

### 초기값

선택이다. 값을 넣지 않으면 `undefined` 가 들어 있다.

```javascript
let message;
console.log(message);   // undefined
```

### 스코프

스코프 단위가 블록이다.

### 선언 전 사용

할 수 없다. `const` 와 같이 일시적 사각지대가 있다.

```javascript
console.log(count);     // ReferenceError: Cannot access 'count' before initialization
let count = 1;
```

### 재선언

할 수 없다.

```javascript
let a = 1;
let a = 2;      // SyntaxError: Identifier 'a' has already been declared
```

---

## var

다시 할당할 수 있는 변수를 선언한다. `const` 와 `let` 이 생기기 전(2015년 이전)에 쓰던 방식이다.

### 재할당

할 수 있다.

```javascript
var total = 0;
total = 100;
```

### 초기값

선택이다. 값을 넣지 않으면 `undefined` 가 들어 있다.

```javascript
var message;
console.log(message);   // undefined
```

### 스코프

스코프 단위가 함수다.

### 선언 전 사용

할 수 있다. 함수가 시작될 때 변수 이름이 등록되면서 `undefined` 로 초기화되기 때문이다. 선언이 스코프의 맨 위로 끌어올려진 것처럼 동작한다고 해서 호이스팅(hoisting)이라고 한다.

```javascript
console.log(count);     // undefined
var count = 1;
console.log(count);     // 1
```

끌어올려지는 것은 선언뿐이다. 할당은 원래 자리에서 실행된다. 위 코드는 아래처럼 동작한다.

```javascript
var count;
console.log(count);     // undefined
count = 1;
console.log(count);     // 1
```

### 재선언

할 수 있다. 에러 없이 덮어쓴다.

```javascript
var a = 1;
var a = 2;
console.log(a);         // 2
```

### 반복문

`var` 로 선언한 반복 변수는 반복문 전체에서 하나다. `let` 으로 선언한 반복 변수는 반복할 때마다 새로 만들어진다.

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
// 3, 3, 3
```

세 함수가 같은 `i` 를 본다. 함수가 실행되는 시점에는 반복이 끝나 `i` 가 3 이다.

```javascript
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 0);
}
// 0, 1, 2
```

세 함수가 각각 다른 `j` 를 본다.

---

## const, let, var 비교

| | `const` | `let` | `var` |
| --- | --- | --- | --- |
| 재할당 | 불가 | 가능 | 가능 |
| 초기값 | 필수 | 선택 | 선택 |
| 스코프 단위 | 블록 | 블록 | 함수 |
| 선언 전 사용 | ReferenceError | ReferenceError | `undefined` |
| 재선언 | SyntaxError | SyntaxError | 가능 |

---

## 클래스 필드

클래스 필드는 클래스 본문에 선언하는 변수다. 그 클래스로 만든 객체마다 하나씩 생긴다.

### 선언

키워드 없이 `이름 = 값` 으로 선언한다.

```javascript
class Page {
    total = 0;
    rows = [];
}
```

`const`, `let`, `var` 는 쓸 수 없다. 이 키워드들은 코드가 실행되는 자리에서 쓰는 문장인데, 클래스 본문은 코드를 실행하는 자리가 아니라 클래스의 구성원을 나열하는 자리다.

```javascript
class Page {
    const total = 0;    // SyntaxError: Unexpected identifier
}
```

메서드 안은 코드가 실행되는 자리이므로 `const`, `let` 을 쓴다.

```javascript
class Page {
    total = 0;              // 필드

    calc() {
        const rate = 0.1;   // 지역 변수
        return this.total * rate;
    }
}
```

### 접근

`this` 를 통해 읽고 쓴다. 필드는 객체에 속한 값이기 때문이다.

```javascript
class Page {
    total = 0;

    add(amt) {
        this.total = this.total + amt;
    }
}
```

### 재할당

할 수 있다. 필드에는 재할당을 막는 방법이 없다.

```javascript
const page = new Page();
page.total = 100;
```

---

## 선언 없는 할당

키워드 없이 변수에 값을 넣는 것이다. 엄격 모드에서는 에러가 난다.

```javascript
function calc() {
    total = 10;     // ReferenceError: total is not defined
}
```

엄격 모드가 아닐 때는 에러 없이 전역 변수가 만들어진다. `import` / `export` 를 쓰는 파일과 클래스 안의 코드는 항상 엄격 모드로 실행된다.

---

## 식별자

식별자는 변수, 함수, 클래스처럼 무언가에 붙이는 이름이다.

### 규칙

- 글자, 숫자, `_`, `$` 를 쓸 수 있다.
- 숫자로 시작할 수 없다.
- 대소문자를 구분한다. `itemCd` 와 `itemcd` 는 다른 식별자다.
- `const`, `class`, `return` 같은 예약어는 쓸 수 없다.

### 표기 관례

문법으로 강제되지 않는 관례다.

| 표기 | 대상 | 예 |
| --- | --- | --- |
| camelCase | 변수, 함수 | `searchCondition` |
| PascalCase | 클래스, 컴포넌트 | `LogisCommonUtil` |
| UPPER_SNAKE_CASE | 바뀌지 않는 상수 | `DEFAULT_TTL_MS` |
| `_` 로 시작 | 내부에서만 쓰는 것 | `_applyLogin` |

---

## 정리

- 변수: 값에 붙인 이름. 선언, 초기화, 할당으로 나뉜다.
- 스코프: 변수를 쓸 수 있는 범위. 블록, 함수, 모듈 스코프가 있고 안쪽에서 바깥을 볼 수 있다.
- `const`: 재할당할 수 없는 변수. 스코프 단위는 블록. 객체와 배열의 내용 변경은 가능하다.
- `let`: 재할당할 수 있는 변수. 스코프 단위는 블록.
- `var`: 재할당할 수 있는 변수. 스코프 단위는 함수. 선언 전에 쓰면 `undefined` 다(호이스팅).
- 클래스 필드: 키워드 없이 선언하고 `this` 로 접근한다.
- 선언 없는 할당: 엄격 모드에서 에러가 난다.
- 식별자: 이름. 글자, 숫자, `_`, `$` 로 만들고 숫자로 시작할 수 없다.

---

## Q&A

### Q1. const 를 쓰는 이유

> `let` 으로만 작성해도 동작에는 문제가 없어 보인다. `const` 를 쓰면 재할당을 막는 것 말고, 성능 같은 내부적인 이점이 있는가?
{: .prompt-info }

<details markdown="1">
<summary>답변 보기</summary>

> 성능 이점은 없다. 이점은 코드를 읽고 고칠 때 생긴다.
{: .prompt-tip }

- 성능: 차이가 없다. 엔진은 재할당되지 않는 변수를 코드 분석으로 스스로 알아낸다.
- 읽을 때: 선언한 줄만 보고 "이 변수는 끝까지 같은 값을 가리킨다"는 것을 알 수 있다.
- 고칠 때: 의도하지 않은 재할당이 에러로 드러난다.

```javascript
const step = '2';

if (step = '1') {       // TypeError: Assignment to constant variable.
}                       // let 이었다면 에러 없이 step 이 '1' 로 바뀐다
```

</details>
