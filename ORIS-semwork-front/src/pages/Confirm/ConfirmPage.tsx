import {useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import "@styles/universal.scss"
import axiosConfig from "../../axiosConfig";

export const ConfirmPage = () => {
    const navigate = useNavigate();
    const codeRef = useRef(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        const code = codeRef.current?.value;

        if (!code) {
            setError('Please enter confirmation code');
            return;
        }

        setIsLoading(true);
        setError(null);

        axiosConfig.get(`/confirm/${code}`)
            .then(response => {
                if (response.status === 200) {
                    navigate('/signIn');
                } else {
                    setError(response.data || 'Invalid confirm code. Retry confirm or resign up');
                }
            })
            .catch(error => {
                setError(error.response?.data || 'Invalid confirm code. Retry confirm or resign up');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div style={{width: '70%', transform: 'translateX(25%)', marginTop: '10vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}
            <input type="text" required placeholder="input confirm code" ref={codeRef} />
            <button onClick={handleSubmit} disabled={isLoading} className="button" style={{marginTop: '2vw'}}>
                {isLoading ? 'Confirming...' : 'Confirm'}
            </button>
        </div>
    )
}