---
title: "[JS 기본 7] 날짜"
date: 2026-11-16 13:00:00 +0900
categories: [JavaScript 기본편, 2부 문자열·숫자·날짜]
tags: [javascript]
---

## Date

날짜와 시각을 나타내는 객체다. 안에는 1970년 1월 1일 0시(UTC)부터 지난 밀리초 숫자 하나가 들어 있다.

### 현재 시각

`new Date()` 는 현재 시각의 Date 객체를 만든다. `Date.now()` 는 현재 시각의 밀리초 숫자를 돌려준다.

```javascript
console.log(typeof new Date());     // 'object'
console.log(typeof Date.now());     // 'number'
```

### 연월일로 만들기

`new Date(연, 월, 일, 시, 분, 초)` 로 만든다. 월은 0 부터 센다. 1월이 `0`, 12월이 `11` 이다.

```javascript
const d = new Date(2026, 10, 16);

console.log(d.getMonth());      // 10  (11월)
console.log(d.getHours());      // 0
```

### 문자열로 만들기

`new Date(문자열)` 로 만든다. 형식에 따라 기준 시간대가 다르다.

| 문자열 | 결과 (한국 시간 기준) |
| --- | --- |
| `'2026-11-16'` | 11월 16일 **9시**. UTC 0시로 해석한다 |
| `'2026-11-16T00:00:00'` | 11월 16일 0시. 현지 시간으로 해석한다 |
| `'2026/11/16'` | 11월 16일 0시. 현지 시간으로 해석한다 |
| `'20261116'` | Invalid Date |

```javascript
console.log(new Date('2026-11-16').getHours());             // 9
console.log(new Date('2026-11-16T00:00:00').getHours());    // 0
```

### Invalid Date

해석할 수 없는 문자열로 만든 Date 객체다. 에러가 나지 않는다. `isNaN` 으로 확인한다.

```javascript
const d = new Date('20261116');

console.log(isNaN(d));      // true
```

---

## Date 읽기

### 메서드

| 메서드 | 돌려주는 값 |
| --- | --- |
| `getFullYear()` | 연도 |
| `getMonth()` | 월. 0 ~ 11 |
| `getDate()` | 일. 1 ~ 31 |
| `getDay()` | 요일. 0(일요일) ~ 6(토요일) |
| `getHours()` | 시. 0 ~ 23 |
| `getMinutes()` | 분 |
| `getSeconds()` | 초 |
| `getTime()` | 1970년 1월 1일 0시(UTC)부터 지난 밀리초 |

```javascript
const d = new Date(2026, 10, 16, 9, 5, 7);

console.log(d.getFullYear());   // 2026
console.log(d.getMonth());      // 10
console.log(d.getDate());       // 16
console.log(d.getDay());        // 1  (월요일)
console.log(d.getHours());      // 9
```

### 월

0 부터 센다. 화면에 보여 줄 때는 1 을 더한다.

```javascript
const d = new Date(2026, 10, 16);

console.log(d.getMonth() + 1);  // 11
```

---

## Date 바꾸기

### set 메서드

`setFullYear`, `setMonth`, `setDate` 등은 Date 객체의 내용을 바꾼다. 새 객체를 만들지 않는다.

```javascript
const d = new Date(2026, 10, 16);
d.setDate(1);

console.log(d.getDate());   // 1
```

### 범위를 넘는 값

다음 달이나 다음 해로 넘어간다. 에러가 나지 않는다.

```javascript
const a = new Date(2026, 10, 31);   // 11월 31일은 없다
console.log(a.getMonth() + 1, a.getDate());     // 12 1

const b = new Date(2026, 10, 16);
b.setDate(b.getDate() + 20);
console.log(b.getMonth() + 1, b.getDate());     // 12 6
```

월을 더할 때 그 달에 없는 날짜면 다음 달로 넘어간다.

```javascript
const d = new Date(2026, 0, 31);    // 1월 31일
d.setMonth(d.getMonth() + 1);       // 2월 31일은 없다

console.log(d.getMonth() + 1, d.getDate());     // 3 3
```

### 말일

일에 `0` 을 주면 전달의 마지막 날이 된다. `new Date(연, 월, 0)` 에서 월을 1 부터 센 숫자로 주면 그 달의 말일이 나온다.

```javascript
console.log(new Date(2026, 11, 0).getDate());   // 30  (2026년 11월)
console.log(new Date(2026, 2, 0).getDate());    // 28  (2026년 2월)
console.log(new Date(2024, 2, 0).getDate());    // 29  (2024년 2월)
```

### 복사

`new Date(Date 객체)` 로 복사한다. 할당만 하면 같은 객체를 가리킨다.

```javascript
const a = new Date(2026, 10, 16);
const b = a;
const c = new Date(a);

b.setDate(1);

console.log(a.getDate());   // 1
console.log(c.getDate());   // 16
```

---

## Date 비교와 계산

### 대소 비교

`<`, `>` 는 Date 객체를 밀리초 숫자로 바꿔서 비교한다.

```javascript
console.log(new Date(2026, 10, 16) < new Date(2026, 10, 17));   // true
```

### 일치 비교

`===` 는 참조를 비교한다. 같은 시각이어도 따로 만든 객체면 `false` 다. 시각이 같은지는 `getTime()` 으로 비교한다.

```javascript
const a = new Date(2026, 10, 16);
const b = new Date(2026, 10, 16);

console.log(a === b);                       // false
console.log(a.getTime() === b.getTime());   // true
```

### 빼기

Date 객체끼리 빼면 밀리초 차이가 나온다.

```javascript
const from = new Date(2026, 10, 16);
const to = new Date(2026, 10, 30);

console.log(to - from);                             // 1209600000
console.log((to - from) / (1000 * 60 * 60 * 24));   // 14  (일수)
```

---

## Date 와 문자열

### YYYYMMDD 만들기

연, 월, 일을 각각 꺼내 이어 붙인다. 월과 일은 두 자리로 맞춘다.

```javascript
const d = new Date(2026, 10, 6);

const yyyy = String(d.getFullYear());
const mm = String(d.getMonth() + 1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');

console.log(yyyy + mm + dd);    // '20261106'
```

### toISOString

`YYYY-MM-DDTHH:mm:ss.sssZ` 형식의 문자열을 돌려준다. UTC 기준이라 한국 시간과 9시간 차이가 난다. `JSON.stringify` 도 Date 객체를 이 형식으로 바꾼다.

```javascript
const d = new Date(2026, 10, 16);   // 한국 시간 11월 16일 0시

console.log(d.toISOString());           // '2026-11-15T15:00:00.000Z'
console.log(JSON.stringify({ d }));     // '{"d":"2026-11-15T15:00:00.000Z"}'
```

---

## 날짜 문자열

날짜를 `'20261116'` 같은 문자열로 다루는 것이다.

### 비교

자릿수와 형식이 같은 날짜 문자열은 문자열 대소 비교의 결과가 날짜 순서와 같다.

```javascript
console.log('20261116' < '20261201');   // true

const ymd = '20261116';
console.log(ymd >= '20261101' && ymd <= '20261130');    // true
```

형식이 다르면 결과가 맞지 않는다.

```javascript
console.log('20261116' < '2026-12-01');     // false
```

### 자르기

위치로 연, 월, 일을 꺼낸다.

```javascript
const ymd = '20261116';

console.log(ymd.substring(0, 4));   // '2026'
console.log(ymd.substring(4, 6));   // '11'
console.log(ymd.substring(6));      // '16'
console.log(ymd.substring(0, 6));   // '202611'
```

---

## moment

날짜를 다루는 라이브러리다. `moment(값)` 은 moment 객체를 만든다.

### 만들기

인자 없이 호출하면 현재 시각이다. 문자열이나 Date 객체를 넘길 수 있다.

```javascript
const a = moment();                         // 현재 시각
const b = moment('20261116');
const c = moment('2026-11-16');
const d = moment(new Date(2026, 10, 16));

console.log(b.format('YYYYMMDD'));  // '20261116'
console.log(c.format('YYYYMMDD'));  // '20261116'
console.log(d.format('YYYYMMDD'));  // '20261116'
```

### format

`format(형식)` 은 형식에 맞춘 문자열을 돌려준다.

| 기호 | 뜻 | 예 |
| --- | --- | --- |
| `YYYY` | 연도 네 자리 | `2026` |
| `MM` | 월 두 자리 | `11` |
| `DD` | 일 두 자리 | `06` |
| `HH` | 시 두 자리 (0 ~ 23) | `09` |
| `mm` | 분 두 자리 | `05` |
| `ss` | 초 두 자리 | `07` |

```javascript
const m = moment('20261116');

console.log(m.format('YYYYMMDD'));              // '20261116'
console.log(m.format('YYYY-MM-DD'));            // '2026-11-16'
console.log(m.format('YYYYMM'));                // '202611'
console.log(m.format('YYYY-MM-DD HH:mm:ss'));   // '2026-11-16 00:00:00'
```

대문자 `MM` 은 월이고 소문자 `mm` 은 분이다.

### 유효성

해석할 수 없는 값으로 만든 moment 객체는 `isValid()` 가 `false` 다. 에러가 나지 않고, `format` 은 `'Invalid date'` 라는 문자열을 돌려준다.

```javascript
console.log(moment('20261131').isValid());              // false  (11월 31일은 없다)
console.log(moment('20261131').format('YYYYMMDD'));     // 'Invalid date'
```

### 읽기

`year()`, `month()`, `date()`, `day()` 로 읽는다. 월은 Date 와 같이 0 부터 센다.

```javascript
const m = moment('20261116');

console.log(m.year());      // 2026
console.log(m.month());     // 10
console.log(m.date());      // 16
console.log(m.day());       // 1  (월요일)
```

### 더하기와 빼기

`add(숫자, 단위)`, `subtract(숫자, 단위)` 로 계산한다. 단위는 `'days'`, `'months'`, `'years'` 이고 `'d'`, `'M'`, `'y'` 로 줄여 쓸 수 있다.

```javascript
console.log(moment('20261116').add(1, 'days').format('YYYYMMDD'));          // '20261117'
console.log(moment('20261116').add(1, 'months').format('YYYYMMDD'));        // '20261216'
console.log(moment('20261116').subtract(16, 'd').format('YYYYMMDD'));       // '20261031'
```

월을 더했을 때 그 달에 없는 날짜면 그 달의 말일이 된다.

```javascript
console.log(moment('20260131').add(1, 'months').format('YYYYMMDD'));    // '20260228'
```

### 원본 변경

`add` 와 `subtract` 는 moment 객체 자신을 바꾸고 자신을 돌려준다. 원본을 남기려면 `clone()` 으로 복사한 뒤 계산한다.

```javascript
const a = moment('20261116');
const b = a.add(1, 'd');

console.log(a.format('YYYYMMDD'));  // '20261117'  (a 도 바뀌었다)
console.log(a === b);               // true
```

```javascript
const a = moment('20261116');
const b = a.clone().add(1, 'd');

console.log(a.format('YYYYMMDD'));  // '20261116'
console.log(b.format('YYYYMMDD'));  // '20261117'
```

### 차이

`a.diff(b, 단위)` 는 `a - b` 를 지정한 단위로 돌려준다. 소수점 아래는 버린다. 단위를 생략하면 밀리초다.

```javascript
console.log(moment('20261130').diff(moment('20261116'), 'days'));       // 14
console.log(moment('20261116').diff(moment('20261130'), 'days'));       // -14
console.log(moment('20261215').diff(moment('20261116'), 'months'));     // 0  (한 달이 안 된다)
console.log(moment('20261201').diff(moment('20260101'), 'months'));     // 11
```

---

## Date, moment 비교

| | Date | moment |
| --- | --- | --- |
| 종류 | 언어에 들어 있는 객체 | 라이브러리 |
| 월 번호 | 0 부터 | 0 부터 |
| `'20261116'` 해석 | Invalid Date | 2026년 11월 16일 |
| 형식 문자열 만들기 | 직접 이어 붙인다 | `format` |
| 날짜 계산 | `setDate` 등. 원본이 바뀐다 | `add`, `subtract`. 원본이 바뀐다 |
| 없는 날짜(1월 31일 + 1개월) | 3월 3일 | 2월 28일 |
| 차이 | 빼면 밀리초 | `diff` 에 단위를 준다 |

---

## 정리

- Date: 날짜와 시각을 나타내는 객체. 안에 밀리초 숫자 하나를 갖는다.
- 월: Date 와 moment 모두 0 부터 센다.
- `new Date('YYYY-MM-DD')`: UTC 0시로 해석한다. 한국 시간으로는 9시다.
- Invalid Date: 해석할 수 없는 값으로 만든 Date. 에러가 나지 않는다.
- set 메서드: Date 객체의 내용을 바꾼다. 범위를 넘는 값은 다음 달로 넘어간다.
- Date 비교: `<` `>` 는 시각을, `===` 는 참조를 비교한다.
- 날짜 문자열: 형식이 같으면 문자열 비교의 결과가 날짜 순서와 같다.
- moment: 날짜 라이브러리. `format` 으로 문자열을 만들고 `add`, `subtract`, `diff` 로 계산한다.
- moment 의 `add`, `subtract`: 원본을 바꾼다. 원본을 남기려면 `clone()` 을 쓴다.
