import { useState } from 'react';

const UploadImage = () => {
    const [imageBase64, setImageBase64] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result); // Keep the full base64 string
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('https://h43sje6zi4.execute-api.us-east-1.amazonaws.com/dev/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    imageBase64
                }),
            });

            if (!response.ok) {
                // Handle errors
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const data = await response.json();
            setSuccess('Image uploaded successfully!'); // Handle success message
            console.log(data);
        } catch (err) {
            setError(err.message); // Set error message
            console.error('Upload error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 mt-10 rounded shadow-md">
            <h2 className="text-2xl mb-4">Upload Profile Image</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                required 
                className="block w-full p-2 mb-4 border rounded" 
            />
            <input 
                type="file" 
                onChange={handleImageChange} 
                required 
                className="block w-full mb-4" 
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Upload</button>
        </form>
    );
};

export default UploadImage;
