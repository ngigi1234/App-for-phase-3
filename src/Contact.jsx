import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import "./styles.css"; 

// npm i @emailjs/browser

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
    .sendForm('service_lrpz57c', 'template_fo32vq5', form.current, {
        publicKey: 'PcLOgct5WmCIZ8F1p',
      })

      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Enter Name: </label>
      <input type="text" name="user_name" placeholder="Enter Full Names"/>
      <label> Enter Email:</label>
      <input type="email" name="user_email" placeholder="Enter The Email " />
      <label>Enter Message: </label>
      <textarea name="message" placeholder="Enter the Intented Message"/>
      <input type="submit" value="Send" />
    </form>
  );
};

export default Contact;
