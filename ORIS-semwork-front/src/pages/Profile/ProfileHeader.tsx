import {Link, useNavigate} from "react-router-dom";
import '@styles/universal.scss'
import '@styles/profile.scss'
import {useAppContext} from "../../AppContext";

export const ProfileHeader = () => {
    const {user, setUser, isAuthenticated} = useAppContext();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=');
                document.cookie = `${name.trim()}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            });
            setUser(null);
            sessionStorage.removeItem('user');
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <>
            <header>
                <div className="user-info">
                    <span className="username">
                        <strong>
                            {isAuthenticated
                                ? `You are signed in as ${user?.username}`
                                : 'You are not signed in'}
                        </strong>
                    </span>
                    {isAuthenticated ? (
                        <button className="button" onClick={logout}>Sign Out</button>
                    ) : (
                        <Link className="button" to='/signIn'>Sign In</Link>
                    )}
                </div>
            </header>
            <nav id="sidebar">
                <ul>
                    <li><Link to="/profile">About me</Link></li>
                    <li><Link to="/all_questions">All questions</Link></li>
                    <li><Link to="/my_questions">My questions</Link></li>
                    <li><Link to="/favorites_answers">Favorites answers</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/rating">Rating</Link></li>
                    {user?.role !== 'USER' && (
                        <li><Link to="/admin_menu">Admin settings</Link></li>
                    )}
                    <li><Link to="/">Go to main</Link></li>
                </ul>
            </nav>
        </>
    );
};