import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './components/Calendar';
import EventDetails from './components/EventDetails';
import { EventProvider } from './context/EventContext';

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <header className="bg-gray-100 dark:bg-gray-900 text-center py-4 shadow-md">
            <h1 className="text-2xl font-bold">Calendify</h1>
          </header>
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;
