import React, { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './Events.css'; // Import the CSS file

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = [];
        querySnapshot.forEach((doc) => {
          fetchedEvents.push({ id: doc.id, ...doc.data() });
        });
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        eventName,
        organizer,
        time,
        date,
      });
      console.log('Event added with ID: ', docRef.id);
      // Reset form fields
      setEventName('');
      setOrganizer('');
      setTime('');
      setDate('');
      // Update the events list
      setEvents([...events, { id: docRef.id, eventName, organizer, time, date }]);
    } catch (error) {
      console.error('Error adding event: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      console.log('Event deleted with ID: ', id);
      // Update the events list after deletion
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  return (
    <div className="event-form-container">
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="organizer">Organizer:</label>
          <input
            type="text"
            id="organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="text"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="text"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-event-button">Add Event</button>
      </form>
      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-item-container">
            <div className="event-item">
              <h3>{event.eventName}</h3>
              <p>Organizer: {event.organizer}</p>
              <p>Time: {event.time}</p>
              <p>Date: {event.date}</p>
              <button onClick={() => handleDelete(event.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventForm;
