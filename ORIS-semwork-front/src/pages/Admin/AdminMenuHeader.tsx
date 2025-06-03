import {Link} from "react-router-dom";

export const AdminMenuHeader = () => {
    return (
        <section className="menu-card">
            <h1>Admin settings page</h1>
            <Link to="/all_users">All users</Link>
            <Link to="/all_categories">All categories</Link>
            <Link to="/all_rewards">All rewards</Link>
        </section>

    )
}