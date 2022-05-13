import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

//define reducer out of component
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val, //componentからのpayloadはactionオブジェクトから受け取る
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = props => {
  //   const [enteredValue, setEnteredValue] = useState('');
  //   const [isValid, setIsValid] = useState(false);
  //   関連する複数のstateを一元管理するにはuseStateよりもuseReducerのほうがmake sense
  //第2引数はoptionalで初期stateをセットすることができる
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '', //props.valueがなければempty strings
    isValid: props.initialValid || false, //props.validがなければfalse
    isTouched: false,
  });

  //dependencyにpropsを丸ごとセットすると親コンポーネントがrenderingされるたびに新しいpropsを渡してくるのでinfinite loopの原因になる
  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    //state(valueとisValid)が変化するたびに他のコンポーネントでその値を使用したい
    //それぞれの子コンポーネント(Input)の入力と親コンポーネント(NewPlace)のreducerで一括管理するため
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);
  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators, //array
    });
  };
  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };
  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler} //focusが外れたとき(onFocusはfocusされたとき)
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.row || 3}
        onChange={changeHandler}
        onBlur={touchHandler} //focusが外れたとき(onFocusはfocusされたとき)
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
