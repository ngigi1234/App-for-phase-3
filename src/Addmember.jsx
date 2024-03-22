import React, { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import './Members.css'; // Import the CSS file

const Addmember = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'members'));
        const fetchedMembers = [];
        querySnapshot.forEach((doc) => {
          fetchedMembers.push({ id: doc.id, ...doc.data() });
        });
        setMembers(fetchedMembers);
      } catch (error) {
        console.error('Error fetching members: ', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editMemberId) {
        await updateDoc(doc(db, 'members', editMemberId), {
          name,
          image,
          phoneNumber,
          location,
          email,
        });
        console.log('Member updated with ID: ', editMemberId);
        setEditMemberId(null);
        setIsEditing(false);
      } else {
        const docRef = await addDoc(collection(db, 'members'), {
          name,
          image,
          phoneNumber,
          location,
          email,
        });
        console.log('Member added with ID: ', docRef.id);
      }
      // Reset form fields
      setName('');
      setImage('');
      setPhoneNumber('');
      setLocation('');
      setEmail('');
    } catch (error) {
      console.error('Error adding/updating member: ', error);
    }
  };

  const handleEdit = (memberId) => {
    const memberToEdit = members.find((member) => member.id === memberId);
    if (memberToEdit) {
      setName(memberToEdit.name);
      setImage(memberToEdit.image);
      setPhoneNumber(memberToEdit.phoneNumber);
      setLocation(memberToEdit.location);
      setEmail(memberToEdit.email);
      setEditMemberId(memberId);
      setIsEditing(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'members', id));
      console.log('Member deleted with ID: ', id);
      // Update the members list after deletion
      setMembers(members.filter((member) => member.id !== id));
    } catch (error) {
      console.error('Error deleting member: ', error);
    }
  };

  return (
    <div className="event-form-container">
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-event-button">{isEditing ? 'Update Member' : 'Add Member'}</button>
      </form>
      <div className="events-list">
        {members.map((member) => (
          <div key={member.id} className="event-item-container">
            <div className="event-item">
              <h3>{member.name}</h3>
              <img src={member.image} alt="Member" />
              <p>Phone Number: {member.phoneNumber}</p>
              <p>Location: {member.location}</p>
              <p>Email: {member.email}</p>
              <button onClick={() => handleEdit(member.id)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(member.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addmember;
