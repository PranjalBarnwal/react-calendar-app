import { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import EventForm from './EventForm';
import { getDaysInMonth, format, subMonths, addMonths } from 'date-fns';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const categoryColors = {
  Work: 'bg-blue-500',
  Personal: 'bg-green-500',
  Other: 'bg-red-500',
};

const Calendar = () => {
  const { events, addEvent, editEvent, deleteEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const eventsForMonth = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfMonth && eventDate <= endOfMonth;
    });
    if (filterCategory === 'All') {
      setFilteredEvents(eventsForMonth);
    } else {
      setFilteredEvents(eventsForMonth.filter(event => event.category === filterCategory));
    }
  }, [currentDate, events, filterCategory]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const renderDates = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = getDaysInMonth(startOfMonth);
    const dayOfWeek = startOfMonth.getDay();

    const dates = [];
    for (let i = 0; i < dayOfWeek; i++) {
      dates.push(<div key={`empty-${i}`} className="p-2 border border-gray-200 dark:border-gray-700" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dailyEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i &&
               eventDate.getMonth() === currentDate.getMonth() &&
               eventDate.getFullYear() === currentDate.getFullYear();
      });

      dates.push(
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 p-2 relative cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => handleDayClick(date)}
        >
          <div>{i}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {dailyEvents.length > 0 && dailyEvents.map((event, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${categoryColors[event.category]} ${index > 2 ? 'hidden' : ''}`}
                title={event.title}
              />
            ))}
            {dailyEvents.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +{dailyEvents.length - 3}
              </div>
            )}
          </div>
        </div>
      );
    }

    return dates;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
          &lt; Prev
        </button>
        <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
          Next &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 text-center gap-1">
        {days.map(day => (
          <div key={day} className="flex justify-center py-2 font-semibold">
            {day}
          </div>
        ))}
        {renderDates()}
      </div>
      {showForm && selectedDate && (
        <EventForm date={selectedDate} closeForm={() => setShowForm(false)} />
      )}
      <div className="mt-6">
        <div className="mb-4 flex justify-between items-center">
          <label className="mr-2">Filter by category:</label>
          <select
            value={filterCategory}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded text-black"
          >
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <ul className="list-disc pl-5">
          {filteredEvents.map(event => {
            const eventDate = new Date(event.date);
            const formattedDate = format(eventDate, 'MMMM d, yyyy');
            return (
              <li key={event.id} className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className={`w-2.5 h-2.5 rounded-full ${categoryColors[event.category]} inline-block`} />
                  <span className="ml-2">
                    {event.title} - {event.category} - {formattedDate}
                  </span>
                </div>
                <div>
                  <button
                    className="text-blue-500 dark:text-blue-300 hover:underline mx-2"
                    onClick={() => {
                      setSelectedDate(new Date(event.date));
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 dark:text-red-300 hover:underline"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
