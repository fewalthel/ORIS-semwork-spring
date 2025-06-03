import '@styles/universal.scss'
import '@styles/signup.scss'
import {useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import axiosConfig from "../../axiosConfig";

export const SignUpPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Добавлено состояние загрузки

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const signUpRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await axiosConfig.post('/signUp', {
                email: formData.email,
                username: formData.username,
                password: formData.password
            });
            navigate('/confirm');
        } catch (error) {
            setError(error.response?.data)
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="register-form">
            <h1>Tell us about yourself</h1>
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}
            <form onSubmit={signUpRequest}>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="example@email.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    placeholder="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <button
                    className="toggle-password"
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    disabled={isLoading}
                >
                    <span>{isPasswordVisible ? "Hide password" : "Show password"}</span>
                </button>
                <button type="submit" id="button" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};