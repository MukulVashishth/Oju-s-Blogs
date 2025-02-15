import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const naviagte = useNavigate();
  const dispath = useDispatch();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async (type = "login") => {
    try {
      const res = await axios.post(`https://oju-blog-backend.onrender.com/api/user/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });

      const data = res.data;
      return data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('No response from the server');
      } else {
        toast.error('An error occurred while sending the request');
      }
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let isError = false;
  
    if (isSignup && !inputs.name) {
      toast.error('Please enter your name');
      isError = true;
    }
  
    if (!inputs.email) {
      toast.error('Please enter your email');
      isError = true;
    }
  
    if (!inputs.password) {
      toast.error('Please enter your password');
      isError = true;
    }
  
    if (isError) {
      return;
    }
  
    try {
      const data = isSignup ? await sendRequest('signup') : await sendRequest();
      localStorage.setItem('userId', data.user._id);
      dispath(authActions.login());
      naviagte('/blogs');
    } catch (error) {
      toast.error(error);
      console.log( "an error ocurred" + error);
      console.error(error);

    }
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          maxWidth={400}
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent={"center"}
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin="auto"
          marginTop={5}
          borderRadius={5}
        >
          <Typography variant="h2" padding={3} textAlign="center">
            {isSignup ? "Signup" : "Login"}
          </Typography>
          {isSignup && (
            <TextField
              name="name"
              onChange={handleChange}
              value={inputs.name}
              placeholder="Name"
              margin="normal"
            />
          )}
          <TextField
            name="email"
            onChange={handleChange}
            value={inputs.email}
            type={"email"}
            placeholder="Email"
            margin="normal"
          />
          <TextField
            name="password"
            onChange={handleChange}
            value={inputs.password}
            type={"password"}
            placeholder="Password"
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 3, marginTop: 3 }}
            color="secondary"
          >
            Submit
          </Button>
          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ borderRadius: 3, marginTop: 3 }}
          >
            Change To {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>

      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Auth;
