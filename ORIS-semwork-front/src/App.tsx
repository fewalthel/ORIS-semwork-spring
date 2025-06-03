import {BrowserRouter as Router} from 'react-router-dom';
import AppContent from "./AppContent";
import {AppProvider} from "./AppContext";

function App() {
    return (
        <Router>
            <AppProvider>
                <AppContent/>
            </AppProvider>
        </Router>
    );
}

export default App;