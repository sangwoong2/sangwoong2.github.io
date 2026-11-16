---
title: "7-3. async/await"
date: 2026-11-16 07:03:00 +0900
categories: [JS, 7. 비동기]
---

## async 함수

`async` 를 붙인 함수는 항상 Promise 를 돌려준다.

### 반환값

| 함수 안에서 | 돌려주는 Promise |
| --- | --- |
| `return 값` | 그 값으로 성공 |
| `return` 없음 | `undefined` 로 성공 |
| 에러를 던짐 | 그 에러로 실패 |

```javascript
const getCount = async () => 1;

console.log(getCount());            // Promise
console.log(await getCount());      // 1
```

---

## await

`await promise` 는 Promise 의 결과가 정해질 때까지 그 함수의 실행을 멈췄다가, 결과 값을 꺼내 준다.

```javascript
const load = async () => {
    const rows = await fetchRows();     // 결과가 올 때까지 이 함수는 여기서 멈춘다
    console.log(rows.length);
};
```

### 쓸 수 있는 자리

`async` 함수 안에서만 쓸 수 있다.

```javascript
const load = () => {
    const rows = await fetchRows();
    // SyntaxError: await is only valid in async functions and the top level bodies of modules
};
```

### 멈추는 범위

멈추는 것은 `await` 가 들어 있는 그 함수뿐이다. 그 함수를 호출한 쪽은 멈추지 않고 다음 줄로 넘어간다. 스레드도 멈추지 않는다.

```javascript
const order = [];

const load = async () => {
    order.push('load 시작');
    await fetchRows();
    order.push('load 의 await 뒤');
};

load();
order.push('호출한 쪽의 다음 줄');

// 이후: ['load 시작', '호출한 쪽의 다음 줄', 'load 의 await 뒤']
```

`await` 를 만나기 전까지는 일반 함수처럼 바로 실행된다.

### 실패한 Promise

`await` 한 Promise 가 실패하면 그 자리에서 에러가 던져진다. `try/catch` 로 잡는다.

```javascript
const load = async () => {
    try {
        const rows = await fetchRows();
        return rows;
    } catch (e) {
        console.log('조회 실패: ' + e.message);
        return [];
    }
};
```

### Promise 가 아닌 값

그 값이 그대로 나온다.

```javascript
console.log(await 5);   // 5
```

---

## await 누락

`await` 를 빼도 문법 에러가 아니다. 에러 없이 다르게 동작한다.

### 결과 대신 Promise

변수에 결과가 아니라 Promise 가 들어간다. 속성을 읽으면 `undefined` 다.

```javascript
const load = async () => {
    const data = fetchData();   // await 누락

    console.log(data);          // Promise
    console.log(data.rows);     // undefined
};
```

### 실행 순서

끝나기를 기다리지 않고 다음 줄이 실행된다.

```javascript
const order = [];

const save = async () => {
    await wait(20);
    order.push('저장 완료');
};

const run = async () => {
    save();                 // await 누락
    order.push('다음 줄');
};

await run();
// 직후: ['다음 줄']
// 나중: ['다음 줄', '저장 완료']
```

### 잡히지 않는 에러

`try` 는 `await` 한 Promise 의 실패만 잡는다. `await` 하지 않은 Promise 가 실패하면 `catch` 로 가지 않는다.

```javascript
const run = async () => {
    try {
        save();     // await 누락. 여기서 실패해도
    } catch (e) {
        // 실행되지 않는다
    }
};
```

---

## try 안의 return

`try` 안에서 Promise 를 `await` 없이 그대로 `return` 하면, 그 Promise 의 실패는 이 함수의 `catch` 가 잡지 못하고 호출한 쪽으로 간다.

```javascript
const load = async () => {
    try {
        return fetchRows();         // 실패하면 호출한 쪽에서 에러가 난다
    } catch (e) {
        return [];                  // 실행되지 않는다
    }
};
```

```javascript
const load = async () => {
    try {
        return await fetchRows();   // 실패하면 아래 catch 가 잡는다
    } catch (e) {
        return [];
    }
};
```

---

## finally

성공하든 실패하든 마지막에 실행된다.

```javascript
const load = async () => {
    showLoading();
    try {
        return await fetchRows();
    } catch (e) {
        showError(e);
        return [];
    } finally {
        hideLoading();      // 항상 실행된다
    }
};
```

---

## 콜백에 넘긴 async 함수

`async` 함수는 Promise 를 돌려주므로, 콜백으로 넘기면 받는 쪽은 Promise 를 받는다.

```javascript
const result = [1, 2].map(async (n) => n * 2);

console.log(result[0]);                 // Promise
console.log(await Promise.all(result)); // [2, 4]
```

---

## then, await 비교

| | `then` | `await` |
| --- | --- | --- |
| 결과를 받는 곳 | 등록한 함수의 인자 | `await` 식의 값 |
| 이어지는 코드 | 등록한 함수 안 | `await` 의 다음 줄 |
| 실패 처리 | `catch(함수)` | `try/catch` |
| 쓸 수 있는 자리 | 어디든 | `async` 함수 안 |

```javascript
fetchRows()
    .then((rows) => console.log(rows.length))
    .catch((e) => console.log(e.message));
```

```javascript
try {
    const rows = await fetchRows();
    console.log(rows.length);
} catch (e) {
    console.log(e.message);
}
```

두 코드는 같은 일을 한다.

---

## 정리

- `async` 함수: 항상 Promise 를 돌려준다. `return` 한 값으로 성공하고, 던진 에러로 실패한다.
- `await`: Promise 의 결과가 정해질 때까지 그 함수의 실행을 멈추고 결과를 꺼낸다. 호출한 쪽과 스레드는 멈추지 않는다.
- `await` 한 Promise 가 실패하면 그 자리에서 에러가 던져진다.
- `await` 를 빼면 결과 대신 Promise 가 들어오고, 끝나기 전에 다음 줄이 실행되고, `try` 가 실패를 잡지 못한다.
- `try` 안에서는 `return await` 로 써야 그 함수의 `catch` 가 실패를 잡는다.
