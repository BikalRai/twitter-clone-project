import './App.css';
import Layout from './components/layout/Layout';
import SiteRoutes from './components/routes/SiteRoutes';

function App() {
    return (
        <div className="App">
            {/* <UserContextProvider> */}
            <Layout>
                <SiteRoutes />
            </Layout>
            {/* </UserContextProvider> */}
        </div>
    );
}

export default App;
