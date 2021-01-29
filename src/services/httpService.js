import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// const jwt = cookies.get('x-auth-token');
// console.log(jwt, 'this inside httpservice');

// axios.defaults.headers.common['x-auth-token'] = jwt;

axios.interceptors.response.use(null, (error) => {
  const expectedErrors =
    error.response &&
    error.response.status > 400 &&
    error.response.status < 500;

  if (error.response.status === 400 || error.response.status === 500) {
    toast.error(error.response.data);
  } else {
    if (expectedErrors) toast.error(error.response.data);
  }

  return Promise.reject(error);
});

const configUrlEncoded = (jwt) => {
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-auth-token': jwt
    },
  };
};
const configJson = (jwt) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': jwt
    }
  };
};

const http = {
  post: axios.post,
  get: axios.get,
  urlEncoded: configUrlEncoded,
  configJson: configJson,
};

// const cookie = {
//     setCookie: cookies.set,
//     getCookie: cookies.get,
//     removeCookie: cookies.remove,
// }

export default http;
export { cookies };
