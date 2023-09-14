import FormContainer from "../src/components/FormContainer";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../store/authSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogIn = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, [navigate, userInfo]);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuccess = (msg) => {
    toast.success(msg, { position: "top-right" });
  };

  const handleError = (msg) => {
    toast.error(msg, { position: "top-left" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3500/api/users/auth",
        formData,
        { withCredentials: true }
      );

      const { message, success } = data;

      if (success) {
        dispatch(setCredentials(data));
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      const msg = error.response.data.message || null;
      if (msg !== null) {
        handleError(msg);
      }
      console.log(error);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            onChange={handleChange}
            name='email'
            value={formData.email}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            onChange={handleChange}
            name='password'
            value={formData.password}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer? <Link to={`/register`}>Register</Link>
        </Col>
      </Row>
      <ToastContainer />
    </FormContainer>
  );
};

export default LogIn;
