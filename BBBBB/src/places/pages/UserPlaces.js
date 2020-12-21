import React from 'react';
import { useParams } from 'react-router-dom'; //useParamsはfunctional component内で使用できる

import PlaceList from '../components/PlaceList';

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

const UserPlaces = () => {
  //useParamsはurlクエリパラメータをオブジェクトとして取得する事ができる
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
