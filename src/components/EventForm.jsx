import { useState, useEffect } from 'react';
import { useEvents } from '../context/EventCOntext';

const EventForm = ({ date, closeForm }) => {
  const { events, addEvent, editEvent } = useEvents(); // Ensure events is retrieved from context
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (date) {
      const existingEvent = events.find(event => new Date(event.date).toDateString() === date.toDateString());
      setEvent(existingEvent);
      if (existingEvent) {
        setTitle(existingEvent.title);
        setCategory(existingEvent.category);
      } else {
        setTitle('');
        setCategory('Work');
      }
    }
  }, [date, events]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { title, date: date.toISOString().split('T')[0], category };
    if (event) {
      editEvent({ ...event, ...newEvent });
    } else {
      addEvent(newEvent);
    }
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl mb-4">{event ? 'Edit Event' : 'Add Event'}</h2>
          <div className="mb-4">
            <label className="block mb-1">Event Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
              onClick={closeForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
