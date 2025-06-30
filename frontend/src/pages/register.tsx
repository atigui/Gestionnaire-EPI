
import React from 'react';
import RegisterForm from "../components/Auth/registerForm";
import logo from "../images/logo-menara.png";

export default function Register() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-8">
          <img src={logo} alt="Menara Préfa" width={200} height={80} className="h-auto" />
             
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
