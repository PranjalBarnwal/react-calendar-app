import { createContext, useState, useContext } from 'react';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents(prevEvents => [...prevEvents, { ...event, id: Date.now() }]);
  };

  const editEvent = (updatedEvent) => {
    setEvents(prevEvents =>
      prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event)
    );
  };

  const deleteEvent = (id) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, editEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};
