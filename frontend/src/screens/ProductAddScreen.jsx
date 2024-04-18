import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { useCreateProductMutation } from '../slices/productsApiSlice';

const ProductAddScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Retrieve token from Redux store

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [showUpgradeButton, setShowUpgradeButton] = useState(false);

  const [createProduct] = useCreateProductMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    try {
      if (!name || !image || !category || !description) {
        throw new Error('Please fill in all the required fields');
      }
      const formData = new FormData();
      console.log('dta',formData)
      formData.append('name', name);
      formData.append('price', price);
      // formData.append('image', image);
      formData.append('category', category);
      formData.append('description', description);


      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      };

      const response = await createProduct(formData, config).unwrap();
      setLoadingCreate(false)

      if (response.upgradeRequired) {
        navigate('/upgrade-account');
      } else {
        toast.success('Product uploaded successfully');
        navigate('/'); 
      }
    } catch (err) {
      setLoadingCreate(false)
      if (err?.data?.upgradeRequired) {
        setShowUpgradeButton(true);
      }
      toast.error(err.message || err?.data?.error || err.error || err);
    }
    setLoadingCreate(false);
  };

 
  return (
    <>
      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Upload Item</h1>
        {loadingCreate && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter title'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter price in dollars'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='image'>
            <Form.Label>Upload Cover Image</Form.Label>
            <Form.Control
              // className='my-3'
              label='Choose File'
              onChange={(e) => setImage(e.target.files)}
              // onChange={uploadFileHandler}
              type='file'
            />
            {/* {loadingUpload && <Loader />} */}
          </Form.Group>
          {/* <Form.Group controlId='fileUrl'>
            <Form.Label>Upload Audio/Video</Form.Label>
            <Form.Control
              // className='my-3'
              label='Choose File'
              onChange={(e) => setFileUrl(e.target.files[0])}
              // onChange={uploadMediaHandler}
              type='file'
            />
            {/* {loadingUploadMedia && <Loader />} */}
          {/* </Form.Group> */}

          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button type='submit' variant='primary'>
              Upload
            </Button>
            {showUpgradeButton && (
              <Button
                variant='primary'
                onClick={() => {
                  navigate('/upgrade'); // Redirect to the upgrade page
                }}
              >
                Upgrade Account
              </Button>
            )}
          </div>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductAddScreen;
