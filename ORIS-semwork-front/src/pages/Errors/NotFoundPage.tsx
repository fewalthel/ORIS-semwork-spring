import {Link} from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div
            style={{
                backgroundColor: '#f6f1eb',
                minWidth: '100vw',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    paddingTop: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <h1
                    style={{
                        fontSize: '20vw',
                        color: 'var(--dark-text-color)',
                        display: 'inline-block',
                    }}
                >
                    404
                </h1>
                <img
                    src="/not-found.png"
                    alt="Not found"
                    style={{
                        width: '14vw',
                        display: 'inline-block',
                        paddingLeft: '20px',
                    }}
                />
                <p
                    style={{
                        color: 'var(--dark-text-color)',
                        fontSize: '2vw',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    page not found
                    <Link to="/" className="button">return to main</Link>
                </p>
            </div>
        </div>
    );
};
