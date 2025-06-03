import '@styles/universal.scss'
import '@styles/signin.scss'

import {Link, useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import {useAppContext} from "../../AppContext";
import axiosConfig from "../../axiosConfig";
import {User} from "@types/models";
import Cookies from "js-cookie";


export const SignInPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const {setUser} = useAppContext();

    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            await login({username, password});
        } catch (error) {
            setError(error.response?.data)
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: { username: string, password: string }) => {
        setIsLoading(true);
        try {
            const response = await axiosConfig.post('/signIn', credentials)

            const headerValue = response.headers['authorization']
            if (headerValue && headerValue.startsWith("Bearer ")) {
                localStorage.setItem('jwtToken', headerValue.split(" ")[1])
            }

            localStorage.setItem('user', JSON.stringify(response.data));

            console.log(response.data);
            setUser(response.data as User);

            navigate('/profile')
        } catch (error) {
            setError(error.response?.data)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h1>Authorization</h1>
            <p>please enter your username and password</p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="example_username"
                    required
                    ref={usernameRef}
                />

                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="password"
                    required
                    ref={passwordRef}
                />
                <button
                    className="toggle-password"
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <span>{isPasswordVisible ? "Hide password" : "Show password"}</span>
                </button>

                <div id="container-for-buttons">
                    <button
                        type="submit"
                        className="button"
                        id="sign-in"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                    <Link className="button" to="/signUp">
                        I am a new user
                    </Link>
                </div>
            </form>
        </div>
    );
};
