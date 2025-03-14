import { useState, useContext } from 'react';
import Button from './UI/Buttons';
import Modal from './UI/Modal';
import Signup from './Signup';
import Input from "./UI/Input.jsx";
import { useActionState } from "react";
import { useNavigate } from 'react-router-dom';
import useHttp from "../hooks/useHttp.js";
import { UserProgressContext } from '../store/UserProgressContext.jsx';

const postConfig = { method: "POST", headers: { "Content-Type": "application/json" }, credentials: 'include' };

function LoginModal() {
   
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const navigate = useNavigate();
  const progressCtx = useContext(UserProgressContext);

  const { data,
              error,
              sendRequest,
              clearData
          } = useHttp('https://fooders-backend-lccf.onrender.com/login', postConfig)

  

  function openSignupModal() {
    progressCtx.showSignup();
  }

  function closeSignupModal() {
    progressCtx.hideSignup();
    progressCtx.showLogin(); 
  }

  let token;

  async function loginAction(prevState, formData) {
    const userData = Object.fromEntries(formData.entries()); // Convert FormData to object

    const response = await sendRequest(JSON.stringify(userData));

    if (response) {
        token = response.token;
        progressCtx.setIsAuthenticated(true);
        progressCtx.hideLogin();
        navigate('/');
        return { success: "Login successful!" };
    }
}

  const [formState, formAction] = useActionState(loginAction, null);

  function handleClose(){
    progressCtx.hideLogin();
  }

  return (
    <>
        <form action={formAction}>
          <h2>Login</h2>
          
          <Input label='E-Mail' type='email' id='email' />
          <Input label='Password' type='password' id='password' />
          
          <Button className='button' >
            Login
          </Button>

          <p onClick={openSignupModal} style={{ cursor: "pointer", color: "blue" }}>
            Don't have an account? Sign Up
          </p>

          <Button textOnly onClick={handleClose} style={{ color: 'black' }} type='button'>Close</Button>
        </form>
        <Modal open={progressCtx.progress === 'signup'} >
            <Signup onClose={() => closeSignupModal()} className='cart' />
        </Modal>
    </>
  );
}

export default LoginModal;
