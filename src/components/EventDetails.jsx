import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventCOntext';
import EventForm from './EventForm';
import { useState } from 'react';

const EventDetails = () => {
  const { id } = useParams();
  const { events, deleteEvent, editEvent } = useEvents();
  const event = events.find(event => event.id === parseInt(id));
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  if (!event) {
    return <p>Event not found</p>;
  }

  const handleDelete = () => {
    deleteEvent(event.id);
    navigate('/');
  };

  const handleEdit = (updatedEvent) => {
    editEvent(updatedEvent);
    setEditing(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded shadow-lg">
      <h2 className="text-2xl mb-4">{event.title}</h2>
      <p>Date: {event.date}</p>
      <p>Category: {event.category}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setEditing(true)}
          className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
      {editing && (
        <EventForm
          date={event.date}
          initialEvent={event}
          closeForm={() => setEditing(false)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
};

export default EventDetails;
