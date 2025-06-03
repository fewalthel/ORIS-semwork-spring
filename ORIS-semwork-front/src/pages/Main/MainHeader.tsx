import {Link} from "react-router-dom";
import {useAppContext} from "../../AppContext";

export const MainHeader = () => {
    const { isLoading, error, logout, isAuthenticated } = useAppContext();

    // Обработка состояния загрузки
    if (isLoading) {
        return (
            <header>
                <nav>
                    <ul>
                        <li><a className="button">About Us</a></li>
                        <li><button className="button" disabled>Loading...</button></li>
                    </ul>
                </nav>
            </header>
        );
    }

    // Обработка ошибок
    if (error) {
        return (
            <header>
                <nav>
                    <ul>
                        <li><a className="button">About Us</a></li>
                        <li><button className="button" onClick={logout}>Try Again</button></li>
                    </ul>
                </nav>
            </header>
        );
    }

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <a className="button">About Us</a>
                        <ul className="dropdown">
                            <p>
                                This site was created for mutual assistance<br/>
                                to each other in their studies.<br/>
                                Here you can ask questions and<br/>
                                other peers will answer you.<br/>
                                Enjoy!
                            </p>
                        </ul>
                    </li>

                    {!isAuthenticated ? (
                        <li><Link className="button" to="/signIn">Sign In</Link></li>
                    ) : (
                        <>
                            <li><Link className="button" to="/profile">Profile</Link></li>
                            <li><button className="button" onClick={logout}>Sign Out</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};