---
title: "5-3. 프로토타입"
date: 2026-11-16 05:03:00 +0900
categories: [JS, 5. 클래스와 모듈]
---

## 프로토타입

프로토타입은 객체에 연결된 다른 객체다. 객체에서 속성을 찾지 못하면 그 객체의 프로토타입에서 이어서 찾는다.

### 속성을 찾는 순서

객체 자신, 그 객체의 프로토타입, 그 프로토타입의 프로토타입 순서로 찾는다. 이 연결을 프로토타입 체인이라고 한다. 끝까지 없으면 `undefined` 다.

```javascript
class Page {
    name = '화면';      // 인스턴스에 있다

    show() {            // 프로토타입에 있다
        return this.name;
    }
}

const page = new Page();

console.log(page.name);     // '화면'      (page 자신에서 찾는다)
console.log(page.show());   // '화면'      (page 의 프로토타입에서 찾는다)
console.log(page.none);     // undefined   (끝까지 없다)
```

### 없는 메서드

속성이 없으면 `undefined` 이므로, 그것을 호출하면 에러가 난다.

```javascript
page.none();    // TypeError: page.none is not a function
```

---

## 클래스와 프로토타입

클래스의 메서드는 `클래스.prototype` 이라는 객체에 저장된다. `new` 로 만든 인스턴스의 프로토타입이 이 객체다.

### 메서드의 위치

인스턴스에는 없고 `클래스.prototype` 에 있다. 모든 인스턴스가 같은 함수를 쓴다.

```javascript
const page = new Page();

console.log(page.hasOwnProperty('show'));               // false
console.log(Page.prototype.hasOwnProperty('show'));     // true
console.log(Object.getPrototypeOf(page) === Page.prototype);    // true
```

### 필드의 위치

인스턴스에 있다.

```javascript
console.log(page.hasOwnProperty('name'));   // true
console.log(Object.keys(page));             // ['name']
```

### 상속

`extends` 는 프로토타입을 연결한다. 자식 클래스의 `prototype` 의 프로토타입이 부모 클래스의 `prototype` 이다.

```javascript
class Base {
    hello() { return 'Base'; }
}

class Page extends Base {}

const page = new Page();

console.log(page.hello());  // 'Base'
console.log(Object.getPrototypeOf(Page.prototype) === Base.prototype);  // true
```

`page.hello` 를 찾는 순서는 `page` → `Page.prototype` → `Base.prototype` 이다.

### 자기 속성 우선

체인의 앞쪽에서 먼저 찾으면 거기서 멈춘다. 인스턴스에 같은 이름의 속성이 있으면 프로토타입의 메서드는 쓰이지 않는다.

```javascript
class Page {
    show() { return '메서드'; }
}

const page = new Page();
page.show = () => '인스턴스의 속성';

console.log(page.show());   // '인스턴스의 속성'
```

필드와 메서드의 이름이 같을 때 필드가 이기는 것도 같은 이유다. 필드는 인스턴스에 있고 메서드는 프로토타입에 있다.

---

## 내장 객체의 메서드

배열과 문자열의 메서드도 프로토타입에 있다. 배열마다 `map` 을 갖고 있는 것이 아니라, 모든 배열이 `Array.prototype` 의 `map` 을 함께 쓴다.

```javascript
console.log([].hasOwnProperty('map'));              // false
console.log(Array.prototype.hasOwnProperty('map')); // true
console.log([].map === Array.prototype.map);        // true
```

### 체인의 끝

모든 객체의 체인은 `Object.prototype` 으로 이어지고, 그 프로토타입은 `null` 이다. `toString`, `hasOwnProperty` 가 `Object.prototype` 에 있어서 모든 객체에서 쓸 수 있다.

```javascript
console.log(Object.getPrototypeOf({}) === Object.prototype);    // true
console.log(Object.getPrototypeOf(Object.prototype));           // null
```

---

## 속성 목록과 프로토타입

| 방법 | 프로토타입의 속성 |
| --- | --- |
| `Object.keys(객체)` | 포함하지 않는다 |
| `JSON.stringify(객체)` | 포함하지 않는다 |
| `{ ...객체 }` | 포함하지 않는다 |
| `'키' in 객체` | 포함한다 |
| `for (const 키 in 객체)` | 포함한다. 클래스의 메서드는 제외 |

```javascript
class Page {
    name = '화면';
    show() {}
}

const page = new Page();

console.log(Object.keys(page));     // ['name']
console.log('show' in page);        // true
```

---

## instanceof

`객체 instanceof 클래스` 는 객체의 프로토타입 체인에 `클래스.prototype` 이 있는지를 확인한다.

```javascript
console.log(page instanceof Page);              // true
console.log(Page.prototype.isPrototypeOf(page));    // true
```

---

## class 와 함수

`class` 는 함수와 프로토타입으로 동작한다. 클래스의 타입은 `'function'` 이다. `class` 문법이 생기기 전에는 함수와 `prototype` 을 직접 써서 같은 일을 했다.

```javascript
class A {
    show() {}
}

function B() {}
B.prototype.show = function () {};

console.log(typeof A);  // 'function'
console.log(typeof B);  // 'function'
```

---

## 정리

- 프로토타입: 객체에 연결된 다른 객체. 속성을 찾지 못하면 프로토타입에서 이어서 찾는다.
- 클래스의 메서드는 `클래스.prototype` 에, 필드는 인스턴스에 있다.
- 상속은 프로토타입을 연결하는 것이다.
- 체인의 앞쪽에서 찾으면 거기서 멈춘다. 인스턴스의 속성이 프로토타입의 메서드보다 먼저다.
- 배열과 문자열의 메서드도 프로토타입에 있다.
- `Object.keys`, `JSON.stringify`, 스프레드는 프로토타입의 속성을 포함하지 않는다.
