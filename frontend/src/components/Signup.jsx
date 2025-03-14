import { useActionState, useContext } from "react";

import useHttp from "../hooks/useHttp.js";
import Button from "./UI/Buttons.jsx";
import Input from "./UI/Input.jsx";
import { useNavigate } from "react-router-dom";
import { UserProgressContext } from "../store/UserProgressContext.jsx";


const postConfig = { method: "POST", headers: { "Content-Type": "application/json" } }


export default function Signup({ onClose }) {
  const progressCtx = useContext(UserProgressContext);
  const navigate = useNavigate(); // Create navigate function
     const { data,
            error,
            sendRequest,
            clearData
        } = useHttp('http://localhost:3000/signup', postConfig)
    

    async function signupAction(prevState, formData) {
        const userData = Object.fromEntries(formData.entries()); // Convert FormData to object
        
        const response = await sendRequest(JSON.stringify(userData));
        if(response){
          progressCtx.hideSignup();
          progressCtx.showLogin();
          navigate(response.redirect);
          return { success: "User created successfully!"};
        }
        
      }

  const [formState, formAction] = useActionState(signupAction, null);

    return (
        <form action={formAction}>
      <h2>Signup</h2>

     <Input label='Full Name' type='text' id='fullName' />
     <Input label='E-Mail' type='email' id='Signupemail' />      

      <Input label='Ph Number' type='text' id='phNumber' />
      <Input label='Address' type='text-box' id='address' />
      <Input label='Password' type='password' id='Signuppassword' />

      <Button className='button'>
        Register
      </Button>

      <Button textOnly onClick={onClose} style={{ color: 'black' }} type='button'>Close</Button>
    </form>
    
    )
}