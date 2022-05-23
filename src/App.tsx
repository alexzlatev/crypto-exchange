import './styles/index.css'
import { Routes, Route } from 'react-router-dom';

import AppProvider from './contexts/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home';
import CryptoPair from './pages/CryptoPairs';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/404' element={<NotFound />} />
          <Route path=':pairs' element={<CryptoPair />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
