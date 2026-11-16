---
title: "7-5. 비동기에서 자주 틀리는 것"
date: 2026-11-16 07:05:00 +0900
categories: [JS, 7. 비동기]
---

## 배열 메서드와 async 함수

배열 메서드는 콜백이 돌려준 값을 그대로 쓴다. `async` 함수는 Promise 를 돌려주므로, 배열 메서드는 결과가 아니라 Promise 를 받는다. 배열 메서드는 Promise 를 기다리지 않는다.

| 메서드 | `async` 콜백을 넘겼을 때 |
| --- | --- |
| `forEach` | 기다리지 않고 바로 끝난다 |
| `map` | Promise 의 배열이 나온다 |
| `filter` | 모든 요소가 남는다 |
| `find`, `some` | 첫 요소에서 참이 된다 |

### forEach

콜백들을 시작만 시키고 끝난다. `forEach` 다음 줄은 콜백들이 끝나기 전에 실행된다.

```javascript
const order = [];

[1, 2, 3].forEach(async (n) => {
    await wait(20);
    order.push(n);
});
order.push('forEach 끝');

// 직후: ['forEach 끝']
// 나중: ['forEach 끝', 1, 2, 3]
```

### map

Promise 의 배열이 나온다. 결과가 필요하면 `Promise.all` 로 기다린다.

```javascript
const promises = [1, 2].map(async (n) => n * 2);

console.log(promises[0]);                   // Promise
console.log(await Promise.all(promises));   // [2, 4]
```

### filter

Promise 는 객체라서 참 같은 값이다. 조건과 관계없이 모든 요소가 남는다.

```javascript
const result = [1, 2, 3].filter(async (n) => n > 5);

console.log(result);    // [1, 2, 3]
```

### 순서대로 기다리기

하나씩 끝난 뒤에 다음으로 가려면 `for...of` 안에서 `await` 한다.

```javascript
const order = [];

for (const n of [1, 2, 3]) {
    await wait(10);
    order.push(n);
}
order.push('for 끝');

console.log(order);     // [1, 2, 3, 'for 끝']
```

---

## 불필요한 new Promise

이미 Promise 를 돌려주는 함수를 `new Promise` 로 다시 감싸는 것이다.

### 같은 결과

감싸지 않고 그대로 돌려줘도 결과가 같다.

```javascript
const load = () => {
    return new Promise((resolve) => {
        fetchRows().then((rows) => resolve(rows));
    });
};
```

```javascript
const load = () => fetchRows();
```

### 사라지는 실패

안쪽 Promise 가 실패했을 때 `reject` 를 호출하지 않으면, 바깥 Promise 는 성공도 실패도 하지 않는다. 계속 pending 이라서 `await` 한 쪽은 다음 줄로 넘어가지 못한다.

```javascript
const load = () => {
    return new Promise((resolve) => {
        fetchRows().then((rows) => resolve(rows));  // 실패했을 때의 처리가 없다
    });
};

await load();               // fetchRows 가 실패하면 여기서 영원히 멈춘다
console.log('도달하지 못한다');
```

---

## 실패했을 때 해제되지 않는 상태

로딩 표시나 버튼 잠금을 `await` 뒤에서 풀면, 실패했을 때는 그 줄에 도달하지 못해 풀리지 않는다.

```javascript
const run = async () => {
    loading = true;
    try {
        await save();
        loading = false;    // 실패하면 실행되지 않는다
    } catch (e) { }
};
```

`finally` 에서 풀면 성공과 실패 모두에서 실행된다.

```javascript
const run = async () => {
    loading = true;
    try {
        await save();
    } catch (e) {
        showError(e);
    } finally {
        loading = false;
    }
};
```

---

## 응답이 오는 순서

요청을 보낸 순서와 응답이 오는 순서는 다를 수 있다. 나중에 보낸 요청의 응답이 먼저 오면, 먼저 보낸 요청의 응답이 뒤늦게 와서 결과를 덮어쓴다.

```javascript
let latest = null;

const search = async (keyword, ms) => {
    const result = await wait(ms, keyword);
    latest = result;
};

search('첫 번째 조회', 60);     // 응답이 느리다
search('두 번째 조회', 10);     // 응답이 빠르다

// 나중: latest === '첫 번째 조회'
```

화면에는 두 번째 조회의 조건이 보이는데 데이터는 첫 번째 조회의 결과가 된다.

---

## await 전후의 상태

`await` 에서 함수가 멈춘 동안 다른 코드가 실행된다. `await` 전에 읽은 값과 `await` 후의 값이 다를 수 있다.

```javascript
const state = { qty: 1 };

const run = async () => {
    const before = state.qty;
    await wait(20);
    return [before, state.qty];
};

const promise = run();
state.qty = 99;     // run 이 await 에서 멈춘 동안 바뀐다

console.log(await promise);     // [1, 99]
```

---

## 정리

- 배열 메서드는 Promise 를 기다리지 않는다. `forEach` 에 `async` 콜백을 넘기면 끝나기 전에 다음 줄이 실행된다.
- `map` 에 `async` 콜백을 넘기면 Promise 의 배열이 나온다. `Promise.all` 로 기다린다.
- 하나씩 순서대로 기다리려면 `for...of` 안에서 `await` 한다.
- 이미 Promise 를 돌려주는 함수는 `new Promise` 로 감싸지 않는다. `reject` 를 연결하지 않으면 실패가 사라지고 계속 pending 이 된다.
- 실패했을 때도 풀어야 하는 상태는 `finally` 에서 푼다.
- 응답은 요청한 순서대로 오지 않는다.
- `await` 전후로 값이 바뀔 수 있다.
