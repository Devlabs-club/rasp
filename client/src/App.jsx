import { Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path='/signin' element={<Signin />} />
      <Route path='/' element={<Dashboard />} /> 
    </Routes>
  );
}

export default App;