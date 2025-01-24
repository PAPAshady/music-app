import Layout from './components/shared/Layout/Layout';
import Home from './pages/Home/Home';

const routes = [{ path: '/', element: <Layout />, children: [{ path: '/', element: <Home /> }] }];

export default routes;
