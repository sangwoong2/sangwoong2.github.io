---
title: "8-7. PureComponent와 다시 그리기"
date: 2026-11-16 08:07:00 +0900
categories: [JS, 8. React]
---

## 다시 그리기

다시 그리기는 React 가 컴포넌트의 `render` 를 다시 호출하는 것이다. `render` 의 결과가 이전과 달라진 부분만 실제 화면에 반영된다.

### 일어나는 경우

| 경우 | 설명 |
| --- | --- |
| `setState` 호출 | 그 컴포넌트가 다시 그려진다 |
| 부모가 다시 그려짐 | 그 안의 자식들이 다시 그려진다 |
| context 의 값 변경 | 그 context 를 쓰는 컴포넌트가 다시 그려진다 |
| `forceUpdate` 호출 | 그 컴포넌트가 다시 그려진다 |

---

## Component

`React.Component` 를 상속한 컴포넌트는 위의 경우에 항상 다시 그려진다. 값이 실제로 바뀌었는지 확인하지 않는다.

```jsx
class Parent extends React.Component {
    state = { count: 0 };

    render() {
        // count 가 바뀔 때마다 Child 도 다시 그려진다
        return <Child title="제목" />;
    }
}
```

---

## PureComponent

`React.PureComponent` 를 상속한 컴포넌트는 다시 그리기 전에 props 와 state 를 이전 것과 비교한다. 전부 같으면 다시 그리지 않는다.

### 얕은 비교

props 와 state 의 각 키를 `===` 로 비교한다. 객체와 배열은 내용이 아니라 참조를 비교한다.

| 이전 값과 새 값 | 비교 결과 | 다시 그리는가 |
| --- | --- | --- |
| 같은 숫자, 같은 문자열 | 같다 | 그리지 않는다 |
| 같은 객체(같은 참조) | 같다 | 그리지 않는다 |
| 내용이 같은 새 객체 | 다르다 | 그린다 |

### 직접 수정한 배열

배열에 `push` 한 뒤 같은 배열을 다시 넣으면 참조가 같다. PureComponent 는 바뀌지 않았다고 판단해서 다시 그리지 않는다. 데이터는 바뀌었는데 화면이 바뀌지 않는다.

```javascript
// PureComponent 를 상속한 컴포넌트 안에서
this.state.rows.push(newRow);
this.setState({ rows: this.state.rows });   // 같은 배열이다. 다시 그려지지 않는다
```

새 배열을 만들어 넣으면 참조가 달라져서 다시 그려진다.

```javascript
this.setState({ rows: [...this.state.rows, newRow] });
```

자식에 props 로 넘긴 배열도 같다. 부모가 배열을 직접 수정하면 PureComponent 인 자식은 다시 그려지지 않는다.

### 매번 새로 만들어지는 props

`render` 안에서 만든 함수와 객체는 그릴 때마다 새로 만들어진다. 참조가 매번 달라서 PureComponent 여도 항상 다시 그려진다.

{% raw %}
```jsx
render() {
    return (
        <Child
            onSave={() => this.save()}      // 그릴 때마다 새 함수
            option={{ editable: true }}     // 그릴 때마다 새 객체
        />
    );
}
```
{% endraw %}

필드에 담아 둔 함수와 객체는 참조가 유지된다.

```jsx
onSave = () => this.save();
option = { editable: true };

render() {
    return <Child onSave={this.onSave} option={this.option} />;
}
```

---

## Component, PureComponent 비교

부모가 다시 그려졌을 때 자식이 다시 그려지는지를 정리한 것이다.

| 상황 | Component | PureComponent |
| --- | --- | --- |
| props 가 이전과 같다 | 그린다 | 그리지 않는다 |
| 배열을 직접 수정하고 같은 참조를 넘겼다 | 그린다 | **그리지 않는다** |
| 새 배열을 넘겼다 | 그린다 | 그린다 |
| 내용이 같은 새 객체를 넘겼다 | 그린다 | 그린다 |
| 같은 값으로 `setState` 했다 | 그린다 | 그리지 않는다 |

---

## 불변 변경이 필요한 이유

PureComponent 는 참조가 바뀌어야 바뀐 것으로 본다. 그래서 state 의 객체와 배열은 직접 수정하지 않고, 바뀐 내용을 가진 새 객체와 새 배열로 교체한다. 1-4 "참조와 복사"의 불변 변경이다.

| 하려는 일 | 직접 수정 | 불변 변경 |
| --- | --- | --- |
| 배열에 추가 | `rows.push(row)` | `[...rows, row]` |
| 배열에서 삭제 | `rows.splice(i, 1)` | `rows.filter((r) => r.id !== id)` |
| 배열의 요소 변경 | `rows[i].qty = 5` | `rows.map((r) => (r.id === id ? { ...r, qty: 5 } : r))` |
| 객체의 속성 변경 | `cond.divCd = '1'` | `{ ...cond, divCd: '1' }` |

---

## key 와 state

목록에서 `key` 가 같은 요소는 같은 컴포넌트로 유지되고 state 도 유지된다. `key` 가 달라지면 이전 것은 사라지고 새 컴포넌트가 만들어진다.

| 변화 | 결과 |
| --- | --- |
| `key` 가 그대로다 | 같은 인스턴스. state 유지. props 만 바뀐다 |
| `key` 가 바뀌었다 | 이전 인스턴스는 언마운트. 새 인스턴스가 만들어지고 state 는 초기값 |

---

## 정리

- 다시 그리기: `render` 를 다시 호출하는 것. `setState`, 부모의 다시 그리기, context 변경으로 일어난다.
- Component: 항상 다시 그린다.
- PureComponent: props 와 state 의 각 키를 `===` 로 비교해서 전부 같으면 다시 그리지 않는다.
- 배열과 객체를 직접 수정하면 참조가 같아서 PureComponent 가 다시 그리지 않는다.
- `render` 안에서 만든 함수와 객체는 매번 새것이라 PureComponent 가 항상 다시 그린다.
- state 의 객체와 배열은 새것으로 교체한다.
