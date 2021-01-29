import http, { cookies } from './../services/httpService.js';
import serverPath from './../services/serverPath.js';

const getSubjects = async () => {
  let { data: subjects } = await http.get(
    serverPath + 'getSubjects.php',
    http.urlEncoded(cookies.get('x-auth-token'))
  );
  return subjects;
};

export default getSubjects;
