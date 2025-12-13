import React, { useState } from 'react'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import axios from 'axios'; 
import './LoginPage.css'

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        if (!username || !password) {
            setError("Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username, 
                password 
            });
            if (response.data.success) {
                const userRole = response.data.user.role;
                alert(`Đăng nhập thành công! Vai trò: ${userRole}`);
                setError('');
            }

        } catch (err) {
           if (axios.isAxiosError(err) && err.response) { 
                setError(err.response.data.message);
            } else {
                setError("Lỗi không xác định hoặc lỗi kết nối.");
            }
        }
    };
    
    return (
        <div className="wapper">
            <form onSubmit={handleSubmit}> 
                <h1>Login</h1>
                <div className="input-box">
                    {/* 3. Liên kết input với state Username */}
                    <input 
                        type="text" 
                        placeholder='Username' 
                        value={username} // Hiển thị giá trị từ state
                        onChange={(e) => { setUsername(e.target.value); setError(''); }} // Cập nhật state khi gõ
                    />
                    <FaUser className='icon' />
                </div>
                
                <div className="input-box">
                    {/* 3. Liên kết input với state Password */}
                    <input 
                        type="password" 
                        placeholder='Password' 
                        value={password} // Hiển thị giá trị từ state
                        onChange={(e) => { setPassword(e.target.value); setError(''); }} // Cập nhật state khi gõ
                    />
                    <FaLock className='icon' />
                </div>
                
                <div className="remenber-forgot">
                    <label>
                        <input type="checkbox" /> Remenber me
                    </label>
                    <a href="#">Forgot password</a>
                </div>
                 {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
                
                <button type='submit'>Login</button>
                
                <div className="register-link">
                    <p> Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
    )
}