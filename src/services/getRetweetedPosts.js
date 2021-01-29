import http, { cookies } from './../services/httpService.js';
import serverPath from './../services/serverPath.js';

const getPosts = async ()=>{
    let { data: posts } = await http.get(
        serverPath + 'getRetweetedPosts.php',
        http.urlEncoded(cookies.get('x-auth-token'))
      );
      return posts;
}

export default getPosts;