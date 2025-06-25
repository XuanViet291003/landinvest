import React, { useState } from 'react';
import Home from './components/Home/Home';
import Map from './components/Map/Index';

const App = () => {
    const [location, setLocation] = useState(null); // State dùng chung

    return (
        <div>
            <Home setLocation={setLocation} />
            <Map location={location} />
        </div>
    );
};

export default App;
