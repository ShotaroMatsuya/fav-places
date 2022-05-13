import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; //useParamsはfunctional component内で使用できる

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Tokyo Tower',
//     description: 'One of the most famous tourist spot in Japan!',
//     imageUrl:
//       'https://d2hpum9hu56in0.cloudfront.net/userimage/photo/image/17267/large_original_aspect_for_pc_375f6b7f-d6d1-4615-a302-1f22fc95e884.jpeg',
//     address: '〒105-0011 東京都港区芝公園４丁目２−８',
//     location: {
//       lat: 35.6585805,
//       lng: 139.7432442,
//     },
//     creator: 'u1',
//   },
// ];

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //useParamsはurlクエリパラメータをオブジェクトとして取得する事ができる
  const userId = useParams().userId;
  useEffect(() => {
    //useEffectにセットするコールバックにasync awaitを直接つけないこと
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
