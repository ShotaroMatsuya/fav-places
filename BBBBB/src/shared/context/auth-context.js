import { createContext } from 'react';

//init context object ,shared between components
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
});
