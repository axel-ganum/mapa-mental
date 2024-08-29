import React, { useState } from 'react'

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword]=useState('');
    const [error, setError] = useState('');
    
    const hamdleRegister = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify({username, email, password}),
            });

            const data = await response.json();

            if(response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('error al registrarse. Por favor, inténtelo de nuevo.')
        }
    }
  return (
    <div className='container mx-auto p-6'>
        <h2 className='text-2xl font-semibold mb-4'>Register</h2>
      <form onSubmit={hamdleRegister} className='bg-white p-6 rounded-lg shadow-lg'>
    <div className='mb-4'> 
        <label className='block text-gray-700'>Nombre de Usuario:</label>
        <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className='w-full px-4 pu-2 border rounded-lg focus:outline-none focus:border-blue-500 '
        required
         
        />

    </div>
    <div className="mb-4">
          <label className="block text-gray-700">Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
    <div className='mb-4'>
        <label className='block text-gray-700'>Contraseña:</label>
        <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full px-4 py-2 border rounded-lg focus-outline-none focus:border-blue-500' 
        required

        />

    </div>
    <div className='mb-4'>
        <label className='"block text-gray-700"'>Confirmar Contraseña:</label>
        <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
    </div>
   {error && <p className='text-red-500 mb-4'>{error}</p>}
  <div className='flex justify-between'>
    <button
     type='submit'
     className='bg-blue-500 text-white px-4 py-2 hover:bg-blue-600'
     >
      Registrarse
    </button>

  </div>
      </form>
    </div>
  )
}

export default RegisterForm
