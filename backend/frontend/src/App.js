import ShowShop from './components/ShowShop.js';
import Login from './components/login.js'
import register from './components/register.js'
import ShowItem from './components/ShowItem.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import MyAccount from './components/MyAccount.js';
import MyItems from './components/MyItems.js';
import AddItem from './components/AddItem.js';

function App() {
  return (
    <>
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' exact Component={ShowShop}/>
          <Route path='/login' Component={Login}/>
          <Route path='/register' Component={register}/>
          <Route path='/item/:id' Component={ShowItem}/>
          <Route path='/account' Component={MyAccount}/>
          <Route path='/myitems' Component={MyItems}/>
          <Route path='/additem' Component={AddItem}/>
        </Routes>
      </div>
    </Router>
    <ToastContainer hideProgressBar={false} newestOnTop={true} autoClose={5000} closeOnClick draggable theme='colored' position='top-center'/>
    </>
  );
}

export default App;
