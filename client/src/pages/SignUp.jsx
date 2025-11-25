import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

import SignUpForm from '../components/auth/SignUpForm.jsx'
import SignUpVerification from '../components/auth/SignUpVerification.jsx'

const SignUp = () => {
    const {signUpStep} = useContext(AuthContext)
    
  return (
    <>
      {signUpStep === 1 && <SignUpForm/>}
      {signUpStep === 2 && <SignUpVerification/>}
    </>
  )
}

export default SignUp









