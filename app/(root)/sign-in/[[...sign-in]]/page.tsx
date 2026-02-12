import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
    return (
        <>
            <div>Sign-In</div>
            <SignIn />
        </>
    )
}

export default SignInPage