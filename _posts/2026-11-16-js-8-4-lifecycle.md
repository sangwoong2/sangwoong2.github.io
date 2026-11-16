---
title: "8-4. 생명주기"
date: 2026-11-16 08:04:00 +0900
categories: [JS, 8. React]
---

## 생명주기

생명주기는 컴포넌트가 화면에 나타나고(마운트), 다시 그려지고(업데이트), 사라지는(언마운트) 과정이다. 각 시점에 React 가 정해진 이름의 메서드를 호출한다.

### 생명주기 메서드

| 메서드 | 호출되는 때 | 횟수 |
| --- | --- | --- |
| `constructor(props)` | 인스턴스가 만들어질 때 | 한 번 |
| `render()` | 그릴 때 | 그릴 때마다 |
| `componentDidMount()` | 처음 화면에 그려진 직후 | 한 번 |
| `componentDidUpdate(prevProps, prevState)` | 다시 그려진 직후 | 다시 그려질 때마다 |
| `componentWillUnmount()` | 화면에서 사라지기 직전 | 한 번 |

이 메서드들은 직접 호출하지 않는다. 이름을 맞춰 만들어 두면 React 가 호출한다.

---

## 호출 순서

부모 `P` 안에 자식 `C` 가 있을 때의 순서다.

### 마운트

부모가 먼저 그려지기 시작하고, 자식의 `componentDidMount` 가 부모보다 먼저 호출된다.

```
P constructor → P render → C constructor → C render → C componentDidMount → P componentDidMount
```

### 업데이트

부모의 state 가 바뀌었을 때다.

```
P render → C render → C componentDidUpdate → P componentDidUpdate
```

### 언마운트

```
C componentWillUnmount
```

---

## componentDidMount

처음 화면에 그려진 직후에 한 번 호출된다. 이 시점에는 화면의 요소와 ref 를 쓸 수 있다. 조회를 시작하거나 구독을 등록하는 자리다.

### setState

여기서 `setState` 를 호출하면 `render` 가 한 번 더 호출된다.

```jsx
class Page extends React.Component {
    state = { rows: [] };

    componentDidMount() {
        this.setState({ rows: [1] });
    }

    render() {
        return <div>{this.state.rows.length}</div>;
    }
}
// render (rows 0건) → componentDidMount → render (rows 1건)
```

### async

`async` 를 붙일 수 있다. React 는 이 메서드가 돌려주는 Promise 를 기다리지 않는다. `await` 에서 멈춘 동안 화면은 이미 그려져 있고 다른 동작이 진행된다.

```jsx
async componentDidMount() {
    const rows = await fetchRows();     // 기다리는 동안 화면은 빈 상태로 보인다
    this.setState({ rows });
}
```

---

## componentDidUpdate

다시 그려진 직후에 호출된다. 인자로 바뀌기 전의 props 와 state 를 받는다. `this.props`, `this.state` 는 바뀐 뒤의 값이다.

### 변경 감지

이전 값과 지금 값을 비교해서 특정 값이 바뀌었을 때만 실행한다.

```jsx
componentDidUpdate(prevProps, prevState) {
    if (prevProps.itemCd !== this.props.itemCd) {
        this.load(this.props.itemCd);
    }
}
```

### 조건 없는 setState

조건 없이 `setState` 를 호출하면 끝나지 않는다. `setState` 로 다시 그려지면 `componentDidUpdate` 가 다시 호출되고, 거기서 또 `setState` 가 호출된다.

```jsx
componentDidUpdate() {
    this.setState({ count: this.state.count + 1 });     // 무한 반복
}
```

---

## componentWillUnmount

화면에서 사라지기 직전에 호출된다. `componentDidMount` 에서 등록한 것을 해제하는 자리다.

| 등록한 것 | 해제 |
| --- | --- |
| `setInterval`, `setTimeout` | `clearInterval`, `clearTimeout` |
| `addEventListener` | `removeEventListener` |
| 구독 | 구독 해제 |

```jsx
componentDidMount() {
    this.timer = setInterval(this.refresh, 60000);
}

componentWillUnmount() {
    clearInterval(this.timer);
}
```

### 해제하지 않았을 때

컴포넌트가 사라진 뒤에도 콜백이 계속 호출된다. 그 안에서 `setState` 를 호출하면 경고가 나온다.

```
Warning: Can't perform a React state update on an unmounted component.
```

조회 응답이 컴포넌트가 사라진 뒤에 도착해서 `setState` 를 호출하는 경우에도 같은 경고가 나온다.

---

## 다시 만들어지는 컴포넌트

조건부 렌더링으로 사라졌다가 다시 나타난 컴포넌트는 이전 인스턴스가 아니라 새 인스턴스다. `constructor` 부터 다시 실행되고 state 는 초기값이다.

```jsx
{this.state.show && <Child />}
```

`show` 를 `false` 로 바꾸면 `Child` 의 `componentWillUnmount` 가 호출되고, 다시 `true` 로 바꾸면 새 `Child` 가 만들어져 `componentDidMount` 가 호출된다.

---

## 정리

- 생명주기: 마운트, 업데이트, 언마운트. 각 시점에 React 가 정해진 메서드를 호출한다.
- `componentDidMount`: 처음 그려진 직후 한 번. 자식이 부모보다 먼저 호출된다.
- `componentDidUpdate(prevProps, prevState)`: 다시 그려진 직후. 이전 값과 비교해서 조건을 건다.
- `componentDidUpdate` 에서 조건 없이 `setState` 를 호출하면 끝나지 않는다.
- `componentWillUnmount`: 사라지기 직전. 등록한 타이머, 이벤트, 구독을 해제한다.
- 사라졌다가 다시 나타난 컴포넌트는 새 인스턴스다.
