import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { myContext } from './Context';
import Frontpage from './FrontPage/Frontpage';
import Home from './Home/Home';
import Errorpage from './Errorpage/Errorpage';

export default function App() {

  const ctx = useContext(myContext);

  return (
    <BrowserRouter>
      <div className="content">
        <Routes>
          {!ctx? (
            <Route path="/" element={<Frontpage />}/>
          ) : (
            <Route path="/home" element={<Home />} />
          )}
          <Route path="*" element={<Errorpage/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
