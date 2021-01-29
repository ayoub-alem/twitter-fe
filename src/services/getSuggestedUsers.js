import http, { cookies } from './httpService.js';
import serverPath from './serverPath.js';

const getSuggestedUsers = async () => {
  let { data: users } = await http.get(
    serverPath + 'getUsers.php',
    http.urlEncoded(cookies.get('x-auth-token'))
  );
  return users;
};

export default getSuggestedUsers;
