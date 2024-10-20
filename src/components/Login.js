import { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null); // To hold any error messages
    const [success, setSuccess] = useState(null); // To hold success messages

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/dev/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            alert(JSON.stringify(response))

            if (!response.ok) {
                throw new Error('Login failed! Please check your credentials.');
            }

            const data = await response.json();
            setSuccess('Login successful!'); // Handle success (e.g., save token, redirect)
            console.log(data); // Log the response data for further processing
        } catch (error) {
            setError(error.message); // Set error message
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 mt-10 rounded shadow-md">
            <h2 className="text-2xl mb-4">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
            {success && <p className="text-green-500 mb-4">{success}</p>} {/* Display success message */}
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
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                Login
            </button>
        </form>
    );
};

export default Login;
