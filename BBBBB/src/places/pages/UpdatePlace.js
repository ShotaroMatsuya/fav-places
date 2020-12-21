import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './PlaceForm.css';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Tokyo Tower',
    description: 'One of the most famous tourist spot in Japan!',
    imageUrl:
      'https://d2hpum9hu56in0.cloudfront.net/userimage/photo/image/17267/large_original_aspect_for_pc_375f6b7f-d6d1-4615-a302-1f22fc95e884.jpeg',
    address: '〒105-0011 東京都港区芝公園４丁目２−８',
    location: {
      lat: 35.6585805,
      lng: 139.7432442,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Tokyo Tow',
    description: 'One of the most famous tourist spot in Japan!',
    imageUrl:
      'https://d2hpum9hu56in0.cloudfront.net/userimage/photo/image/17267/large_original_aspect_for_pc_375f6b7f-d6d1-4615-a302-1f22fc95e884.jpeg',
    address: '〒105-0011 東京都港区芝公園４丁目２−８',
    location: {
      lat: 35.6585805,
      lng: 139.7432442,
    },
    creator: 'u2',
  },
];
const UpdatePlace = () => {
  //urlクエリパラメータから取得
  const placeId = useParams().placeId;
  const [isLoading, setIsLoading] = useState(true);

  /* react hook(useState,use~~など)は関数コンポーネント内直下で唱えないとダメ(thenブロックや
    if statement while loop内では使っちゃダメ) */
  //init custom hook
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  //loading data from backend
  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);
  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]); //setFormDataはuseCallbackでwrapしているので変化することはない

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }
  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };
  if (!identifiedPlace) {
    return (
      <Card>
        <div class="center">
          <h2>Could not find Place!</h2>;
        </div>
      </Card>
    );
  }
  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
