import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Shotaro Matsuya',
      image:
        'https://football-tribe.com/japan/wp-content/uploads/sites/23/2020/01/GettyImages-535012174-800x450.jpg',
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
