import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the form data to the business email address
    sendEmail();
  };

  const sendEmail = () => {
    // Replace 'business-email@example.com' with the actual business email address
    const businessEmail = 'business-email@example.com';

    const emailBody = `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `;

    // You can use your preferred method/library to send an email, such as using the 'mailto' protocol or an API call
    // Here, we use the 'mailto' protocol to open the default email client with the pre-filled email fields
    const mailtoLink = `mailto:${businessEmail}?subject=Contact Us Form Submission&body=${encodeURIComponent(
      emailBody
    )}`;

    window.location.href = mailtoLink;

    // Show a success message to the user
    toast.success('Your message has been sent. We will get back to you soon.');
  };

  return (
    <div>
      <h1>Contact Us</h1>
      <Row>
        <Col xs={12} md={6}>
          <Card style={{ borderRadius: '10px', width:'100%' }}>
            <Card.Img
              src='/mp6.jpeg'
              alt='Image'
              style={{
                height: 'auto',
                width: '100%',
                objectFit: 'contain',
                // float: 'right',
              }}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='phone'>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type='tel'
                placeholder='Enter your phone number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='message'>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as='textarea'
                rows={4}
                placeholder='Enter your message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className='mb-2'
              />
            </Form.Group>

            <Button variant='primary' type='submit'>
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ContactScreen;
