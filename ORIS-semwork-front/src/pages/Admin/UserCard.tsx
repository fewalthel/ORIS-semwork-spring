import {User} from "@types/models";
import {useAppContext} from "../../AppContext";
import {FC, useState} from 'react';
import {handleUpdateRole} from "@api/usersApi";

interface Props {
    userProps: User;
    onDelete: (id: number) => void;
}

const UserCard: FC<Props> = ({userProps, onDelete}) => {
    const {user} = useAppContext();
    const [role, setRole] = useState(userProps.role);

    return (
        <section className="user-card">
            <h2 className="container-for-user-info">
                <div className="container-for-user-data"
                     style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <div>
                        <div className="container-for-qa"
                             style={{alignItems: 'flex-start', display: 'flex', flexDirection: 'column'}}>
                            <h2>username: {userProps.username}</h2>
                            <p> id: {userProps.id}</p>
                            <p className="user_email">email: {userProps.email}</p>
                            <p className="user_role">role: {role}</p>
                        </div>
                    </div>
                    <h4 className="container-for-user-info">
                        {user && userProps.id === user.id && <p className="your-account">your account</p>}

                        {role === 'USER' && (
                            <>
                                <button onClick={() => onDelete(userProps.id)} className="button">
                                    Delete user
                                </button>
                                <select className="user-role-select" defaultValue={role}
                                        onChange={(e) => handleUpdateRole(userProps.id, e.target.value, setRole)}>
                                    <option value="USER">user</option>
                                    <option value="ADMIN">admin</option>
                                </select>
                            </>
                        )}
                    </h4>
                </div>
            </h2>
        </section>
    );
};

export default UserCard;