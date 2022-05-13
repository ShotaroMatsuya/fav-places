import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      //inputIdには'title'や'description'が来る
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          //nameがundefinedのときにループが止まらないようにするために追加
          continue;
        }
        if (inputId === action.inputId) {
          //dispatchされたInputに対して
          formIsValid = formIsValid && action.isValid;
        } else {
          //値の変更がないInputに対して
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

//custom hook ... not sharing data but logic
export const useForm = (initialInputs, initialFormValidity) => {
  //useReducerに使用するinitialStateは引数から受けとるようにする
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity, //stored information of overall form validity
  });
  //子コンポーネントにpropsで渡すのでinfiniteLoopを防ぐためにuseCallbackでmemoする
  //入力されるたびにInputコンポーネントから送られるvalueとvalidityがformReducerにdispatchされる仕組み
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  //initialize form value & validity
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);
  return [formState, inputHandler, setFormData];
};
