import { useState } from 'react';

const SignUp = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        try {
            const response = await fetch('https://h43sje6zi4.execute-api.us-east-1.amazonaws.com/dev/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Handle errors
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const data = await response.json();
            setSuccess('Signup successful!'); // Handle success message
            console.log(data);
        } catch (err) {
            setError(err.message); // Set error message
            console.error('Signup error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 mt-10 rounded shadow-md">
            <h2 className="text-2xl mb-4">Sign Up</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                onChange={handleChange} 
                required 
                className="block w-full p-2 mb-4 border rounded" 
            />
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
                className="block w-full p-2 mb-4 border rounded" 
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Sign Up</button>
        </form>
    );
};

export default SignUp;
