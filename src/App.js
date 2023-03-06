import { useState } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import SiteRoutes from './components/routes/SiteRoutes';

function App() {
    // state for loading
    const [loading, setLoading] = useState(true);

    return (
        <div className="App">
            <Layout loading={loading} setLoading={setLoading}>
                <SiteRoutes loading={loading} setLoading={setLoading} />
            </Layout>
        </div>
    );
}

export default App;
