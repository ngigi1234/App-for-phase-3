import React, { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import './Finance.css'; // Import the CSS file

const Finance = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [finances, setFinances] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFinanceId, setEditFinanceId] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
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

    const fetchFinances = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'finances'));
        const fetchedFinances = [];
        querySnapshot.forEach((doc) => {
          fetchedFinances.push({ id: doc.id, ...doc.data() });
        });
        setFinances(fetchedFinances);
      } catch (error) {
        console.error('Error fetching finances: ', error);
      }
    };

    fetchMembers();
    fetchFinances();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editFinanceId) {
        await updateDoc(firestoreDoc(db, 'finances', editFinanceId), {
          memberId: selectedMember,
          amount,
          description,
        });
        console.log('Finance updated with ID: ', editFinanceId);
        setEditFinanceId(null);
        setIsEditing(false);
      } else {
        const docRef = await addDoc(collection(db, 'finances'), {
          memberId: selectedMember,
          amount,
          description,
        });
        console.log('Finance added with ID: ', docRef.id);
      }
      // Reset form fields
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding/updating finance: ', error);
    }
  };

  const handleEdit = (financeId) => {
    const financeToEdit = finances.find((finance) => finance.id === financeId);
    if (financeToEdit) {
      setSelectedMember(financeToEdit.memberId);
      setAmount(financeToEdit.amount);
      setDescription(financeToEdit.description);
      setEditFinanceId(financeId);
      setIsEditing(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(firestoreDoc(db, 'finances', id));
      console.log('Finance deleted with ID: ', id);
      // Update the finances list after deletion
      setFinances(finances.filter((finance) => finance.id !== id));
    } catch (error) {
      console.error('Error deleting finance: ', error);
    }
  };

  return (
    <div className="finance-container">
      <h2>Finance Tracker</h2>
      <form onSubmit={handleSubmit} className="finance-form">
        <div className="form-group">
          <label htmlFor="member">Member:</label>
          <select
            id="member"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            required
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-finance-button">{isEditing ? 'Update Finance' : 'Add Finance'}</button>
      </form>
      <div className="finances-list">
        {finances.map((finance) => (
          <div key={finance.id} className="finance-item-container">
            <div className="finance-item">
              <p>Member: {members.find((member) => member.id === finance.memberId)?.name}</p>
              <p>Amount: {finance.amount}</p>
              <p>Description: {finance.description}</p>
              <button onClick={() => handleEdit(finance.id)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(finance.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finance;
