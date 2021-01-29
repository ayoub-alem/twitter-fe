import jwt_decode from 'jwt-decode';
import { cookies } from './httpService.js';

const getUser = () => {
  try {
    const jwt = cookies.get('x-auth-token');
    const user = jwt_decode(jwt);
    return user;
  } catch (error) {
    return false;
  }
};

export { getUser };
