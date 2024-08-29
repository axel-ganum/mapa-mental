import React, { useState } from 'react'

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login',{
        method: 'POST',
        headers: {
         'Content-Type': 'application/json', 
        },
        body:JSON.stringify({email, password}),
      });
      const data = await response.json();

      if(response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      }else {
        setError(data.message);
      }
    }catch (error) {
      setError('Error al iniciar sesión. posr favor, inténtelo de nuevo.')
    }
  };
  return (
    <div className='conatainer mx-auto p-6'>
      <h2 className='text-2xl font-semibold mb-4'>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className='bg-white p-6 required-lg shadow-lg'>
        <div className='mb-4'>
          <label className='block text-gray-700'>Correo Electrónico:</label> 
         <input 
         type="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
         required
         />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <div className='flex justify-between'>
          <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
             >
          Iniciar Sesión
          </button>
          </div>
      </form>
    </div>
  )
}

export default LoginForm
