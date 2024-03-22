import React, {useState}from 'react'
import Contact from './Contact';
import EventForm from './EventsForm';
import Addmember from './Addmember';
import Finance from './Finance';

const Sidebar = () => {
    const [showContact, setShowContact] = useState(false);

    const handleContact = () => {
      setShowContact(!showContact);
    };
    const [showEvents, setShowEvents] = useState(false);
  
    const handleEvents= () => {
      setShowEvents(!showEvents);
    };

    const [showmembers, setShowMembers] = useState(false);
  
    const handleMembers= () => {
      setShowMembers(!showmembers);
    };

    const [showfinance, setShowFinance] = useState(false);
  
    const handleFinance= () => {
      setShowFinance(!showfinance);
    };
  
    return (
      <div>
        <button onClick={handleContact}>Contact</button>
        {showContact && <Contact />}
        <button onClick={handleEvents}>Events </button>
        {showEvents && <EventForm />}

        <button onClick={handleMembers}>Members </button>
        {showmembers && <Addmember />}

        <button onClick={handleFinance}>Finance </button>
        {showfinance && <Finance/>}

   
      </div>
    );
 
    
}

export default Sidebar 