import './App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './components/signup';
import SignupPic from './components/signupPic';
import { Route, Switch } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';

function App() {
  toast.configure();
  return (
    <div className='App'>
      <Switch>
        <Route path='/signup_complete' component={SignupPic}></Route>
        <Route path='/signup' component={Signup}></Route>
        <Route path='/login' component={Login}></Route>
        <Route path='/' component={Home}></Route>
      </Switch>
    </div>
  );
}

export default App;
