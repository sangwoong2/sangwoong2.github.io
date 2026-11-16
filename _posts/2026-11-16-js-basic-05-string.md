---
title: "[JS 기본 5] 문자열"
date: 2026-11-16 12:40:00 +0900
categories: [JavaScript 기본편, 2부 문자열·숫자·날짜]
tags: [javascript]
---

## 문자열

문자열은 글자를 순서대로 나열한 값이다. 기본형이다.

### 따옴표

작은따옴표와 큰따옴표 중 어느 것으로 감싸도 같은 문자열이다.

```javascript
console.log('abc' === "abc");   // true
```

### 길이

`length` 속성으로 글자 수를 읽는다.

```javascript
console.log('abc'.length);      // 3
console.log('가나다'.length);   // 3
console.log(''.length);         // 0
```

### 인덱스 접근

`문자열[위치]` 로 한 글자를 읽는다. 위치는 0 부터 센다. 범위를 벗어나면 `undefined` 다.

```javascript
console.log('abc'[0]);      // 'a'
console.log('abc'[5]);      // undefined
```

### 변경 불가

만들어진 문자열의 내용은 바꿀 수 없다. 문자열 메서드는 원본을 바꾸지 않고 새 문자열을 돌려준다.

```javascript
const s = ' abc ';
s.trim();

console.log(s);             // ' abc '
console.log(s.trim());      // 'abc'
```

```javascript
const s = 'abc';
s[0] = 'x';     // TypeError: Cannot assign to read only property '0' of string 'abc'
```

---

## 템플릿 문자열

백틱(`` ` ``)으로 감싼 문자열이다.

### 값 끼워 넣기

`${ }` 안에 적은 식의 결과가 문자열로 변환되어 그 자리에 들어간다.

```javascript
const count = 3;

console.log(`${count}건 조회되었습니다.`);  // '3건 조회되었습니다.'
console.log(`합계: ${1 + 1}`);              // '합계: 2'
```

### 여러 줄

줄바꿈을 그대로 적을 수 있다.

```javascript
const text = `첫째 줄
둘째 줄`;

console.log(text.split('\n').length);   // 2
```

---

## 찾기

### indexOf

찾는 문자열이 처음 나오는 위치를 돌려준다. 없으면 `-1` 이다.

```javascript
console.log('20261116'.indexOf('11'));  // 4
console.log('20261116'.indexOf('99'));  // -1
```

### includes

찾는 문자열이 들어 있으면 `true` 다.

```javascript
console.log('20261116'.includes('11')); // true
console.log('20261116'.includes('99')); // false
```

### startsWith, endsWith

찾는 문자열로 시작하면, 또는 끝나면 `true` 다.

```javascript
console.log('ITEM001'.startsWith('ITEM'));      // true
console.log('report.xlsx'.endsWith('.xlsx'));   // true
```

### 대소문자

구분한다. 찾기 메서드 모두 해당한다.

```javascript
console.log('ITEM001'.startsWith('item'));  // false
```

---

## 자르기

### substring

`substring(시작, 끝)` 은 시작 위치부터 끝 위치 **앞**까지를 돌려준다. 끝을 생략하면 마지막까지다.

```javascript
console.log('20261116'.substring(0, 4));    // '2026'
console.log('20261116'.substring(4, 6));    // '11'
console.log('20261116'.substring(6));       // '16'
```

### slice

`slice(시작, 끝)` 은 `substring` 과 같되, 음수를 주면 뒤에서부터 센다.

```javascript
console.log('20261116'.slice(0, 4));    // '2026'
console.log('20261116'.slice(-2));      // '16'
console.log('20261116'.slice(0, -2));   // '202611'
```

### substr

`substr(시작, 길이)` 는 시작 위치부터 길이만큼을 돌려준다. 두 번째 인자가 끝 위치가 아니라 길이다.

```javascript
console.log('20261116'.substr(4, 2));   // '11'
console.log('20261116'.substr(-2));     // '16'
```

### substring, slice, substr 비교

| | `substring` | `slice` | `substr` |
| --- | --- | --- | --- |
| 두 번째 인자 | 끝 위치 | 끝 위치 | 길이 |
| 음수 | 0 으로 취급 | 뒤에서부터 센다 | 뒤에서부터 센다(첫 인자만) |
| 시작이 끝보다 클 때 | 둘을 바꿔서 자른다 | 빈 문자열 | 해당 없음 |

```javascript
console.log('20261116'.substring(6, 4));    // '11'
console.log('20261116'.slice(6, 4));        // ''
console.log('20261116'.substring(-2));      // '20261116'
```

---

## 바꾸기

### replace

`replace(찾을 것, 바꿀 것)` 은 처음 나오는 하나만 바꾼다. 전부 바꾸려면 찾을 것을 `g` 플래그가 붙은 정규식으로 준다.

```javascript
console.log('a-b-c'.replace('-', ''));      // 'ab-c'
console.log('a-b-c'.replace(/-/g, ''));     // 'abc'
```

### replaceAll

`replaceAll(찾을 것, 바꿀 것)` 은 나오는 것을 전부 바꾼다.

```javascript
console.log('a-b-c'.replaceAll('-', ''));   // 'abc'
```

### trim

앞뒤 공백을 없앤다. `trimStart` 는 앞만, `trimEnd` 는 뒤만 없앤다.

```javascript
console.log(' abc '.trim());        // 'abc'
console.log(' abc '.trimStart());   // 'abc '
console.log(' abc '.trimEnd());     // ' abc'
```

### toUpperCase, toLowerCase

대문자로, 소문자로 바꾼다.

```javascript
console.log('abc'.toUpperCase());   // 'ABC'
console.log('ABC'.toLowerCase());   // 'abc'
```

### padStart, padEnd

`padStart(길이, 채울 글자)` 는 지정한 길이가 될 때까지 앞을 채운다. `padEnd` 는 뒤를 채운다. 이미 그 길이 이상이면 그대로다.

```javascript
console.log('5'.padStart(3, '0'));          // '005'
console.log('5'.padEnd(3, '0'));            // '500'
console.log('123456'.padStart(3, '0'));     // '123456'
console.log(String(7).padStart(2, '0'));    // '07'
```

---

## 나누기와 합치기

### split

`split(구분자)` 는 문자열을 구분자로 나눠 배열로 돌려준다.

```javascript
console.log('a,b,c'.split(','));        // ['a', 'b', 'c']
console.log('2026-11-16'.split('-'));   // ['2026', '11', '16']
console.log('abc'.split(''));           // ['a', 'b', 'c']
```

구분자가 없으면 원래 문자열 하나가 든 배열이다. 빈 문자열을 나눠도 빈 배열이 아니다.

```javascript
console.log('abc'.split(','));  // ['abc']
console.log(''.split(','));     // ['']
console.log('a,,c'.split(',')); // ['a', '', 'c']
```

### join

배열의 메서드다. `join(구분자)` 는 배열의 요소를 구분자로 이어 문자열로 돌려준다. 구분자를 생략하면 쉼표다.

```javascript
console.log(['a', 'b', 'c'].join(','));     // 'a,b,c'
console.log(['a', 'b', 'c'].join(''));      // 'abc'
console.log(['a', 'b'].join());             // 'a,b'
```

`null` 과 `undefined` 는 빈 문자열로 이어진다.

```javascript
console.log([1, null, undefined, 2].join('-'));     // '1---2'
```

---

## 비교

### 일치 비교

`===` 는 글자가 모두 같으면 `true` 다. 대소문자를 구분한다.

```javascript
console.log('abc' === 'abc');                   // true
console.log('abc' === 'ABC');                   // false
console.log('abc'.toUpperCase() === 'ABC');     // true
```

### 대소 비교

`<`, `>` 는 앞 글자부터 차례로 글자의 코드 값을 비교한다. 대문자는 소문자보다 코드 값이 작다.

```javascript
console.log('a' < 'b');     // true
console.log('B' < 'a');     // true
console.log('10' < '9');    // true  ('1' 이 '9' 보다 작다)
```

자릿수가 같은 숫자 문자열은 숫자의 크기 순서와 결과가 같다.

```javascript
console.log('20261116' < '20261201');   // true
```

### localeCompare

`a.localeCompare(b)` 는 언어의 정렬 순서로 비교한다. `a` 가 앞이면 음수, 뒤면 양수, 같으면 `0` 을 돌려준다.

```javascript
console.log('a'.localeCompare('b'));    // -1
console.log('b'.localeCompare('a'));    // 1
console.log('a'.localeCompare('a'));    // 0

console.log(['나', '가', '다'].sort((x, y) => x.localeCompare(y)));     // ['가', '나', '다']
```

---

## 정규식

정규식은 문자열의 패턴을 나타내는 객체다.

### 만드는 방법

`/패턴/플래그` 로 적거나 `new RegExp('패턴', '플래그')` 로 만든다.

```javascript
const a = /^IT/i;
const b = new RegExp('^IT', 'i');

console.log(a.test('item'));    // true
console.log(b.test('item'));    // true
```

### 플래그

| 플래그 | 뜻 |
| --- | --- |
| `g` | 처음 하나가 아니라 전부 찾는다 |
| `i` | 대소문자를 구분하지 않는다 |

### 패턴 기호

| 기호 | 뜻 |
| --- | --- |
| `^` | 문자열의 시작 |
| `$` | 문자열의 끝 |
| `.` | 아무 글자 하나 |
| `\d` | 숫자 하나 |
| `\s` | 공백 하나 |
| `[abc]` | a, b, c 중 하나 |
| `[^abc]` | a, b, c 가 아닌 글자 하나 |
| `[0-9]` | 0 부터 9 중 하나 |
| `+` | 앞의 것이 1번 이상 |
| `*` | 앞의 것이 0번 이상 |
| `{8}` | 앞의 것이 8번 |
| `( )` | 묶음. 찾은 내용을 나중에 꺼내 쓸 수 있다 |
| `\.` | 점 글자 자체. 기호를 글자로 쓰려면 앞에 `\` 를 붙인다 |

```javascript
console.log('a.b'.replace(/./g, 'x'));      // 'xxx'  (. 은 아무 글자)
console.log('a.b'.replace(/\./g, 'x'));     // 'axb'  (\. 은 점 글자)
```

### test

`정규식.test(문자열)` 은 문자열이 패턴에 맞으면 `true` 다.

```javascript
console.log(/^[0-9]+$/.test('12345'));      // true
console.log(/^[0-9]+$/.test('12a45'));      // false
console.log(/^\d{8}$/.test('20261116'));    // true
console.log(/^\d{8}$/.test('2026-11-16'));  // false
```

### match

`문자열.match(정규식)` 은 패턴에 맞는 부분을 배열로 돌려준다. 없으면 `null` 이다. `g` 플래그가 있으면 맞는 부분 전부가 들어 있다.

```javascript
console.log('a1b22c'.match(/\d+/)[0]);  // '1'
console.log('a1b22c'.match(/\d+/g));    // ['1', '22']
console.log('abc'.match(/\d+/));        // null
```

### replace

`replace` 의 첫 인자로 정규식을 주면 패턴에 맞는 부분을 바꾼다. 바꿀 문자열 안의 `$1`, `$2` 는 첫째, 둘째 묶음이 찾은 내용이다.

```javascript
console.log('010-1234-5678'.replace(/[^0-9]/g, ''));    // '01012345678'
console.log('a b  c'.replace(/\s+/g, ' '));             // 'a b c'

console.log('20261116'.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));   // '2026-11-16'
```

---

## 정리

- 문자열: 글자를 나열한 값. 내용을 바꿀 수 없고, 메서드는 새 문자열을 돌려준다.
- 템플릿 문자열: 백틱으로 감싼 문자열. `${ }` 로 값을 끼워 넣는다.
- 찾기: `indexOf` 는 위치를, `includes`, `startsWith`, `endsWith` 는 불리언을 돌려준다.
- 자르기: `substring` 과 `slice` 는 끝 위치를, `substr` 은 길이를 받는다.
- 바꾸기: `replace` 는 하나만, `replaceAll` 과 `g` 플래그 정규식은 전부 바꾼다.
- 나누기와 합치기: `split` 은 문자열을 배열로, `join` 은 배열을 문자열로 만든다.
- 비교: `===` 는 글자가 같은지를, `<` `>` 는 글자 코드 순서를, `localeCompare` 는 언어의 정렬 순서를 비교한다.
- 정규식: 문자열의 패턴을 나타내는 객체. `test`, `match`, `replace` 에 쓴다.
