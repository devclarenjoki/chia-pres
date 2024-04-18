import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { PRODUCTS_URL } from '../constants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductAddForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // Use state to store the selected image file

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userInfoString = localStorage.getItem('userInfo');
  if (!userInfoString) {
    // Handle case where userInfo is not found in localStorage
    console.error('User info not found in localStorage');
    return;
  }

  // Parse userInfo object from string
  const userInfo = JSON.parse(userInfoString);

  const { token } = userInfo;

    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('image', image); // Append the image file to the form data

    try {
      // Send a POST request to the backend API to create the product
      const response = await axios.post(PRODUCTS_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Set Authorization header with token
          // Set content type to multipart/form-data for file upload
        },
      });
      
      console.log('Product created:', response.data);

      if(response){
        toast.success('Product uploaded successfully');
        navigate('/'); 
      }
      // Display a success message to the user
      // alert('Product created successfully');
      // Reset form fields
      setName('');
      setPrice('');
      setCategory('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error creating product:', error);
      // Display an error message to the user
      alert('Error creating product. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setImage(file); // Set the selected file in the state
  };

  return (
    <div>
      <h2>Create a New Product</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Upload Image:</label>
          <input type="file" onChange={handleImageChange} accept="image/*" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductAddForm;
