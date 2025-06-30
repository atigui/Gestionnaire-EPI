import React from 'react';
import LoginForm from "../components/Auth/LoginForm";
import logo from "../images/logo-menara.png"; // Assure-toi que le fichier existe bien ici

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Menara Préfa" className="h-auto w-52" />
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
