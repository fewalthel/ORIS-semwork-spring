import type {User} from "@types/models";
import {lazy, useEffect, useState} from "react";
import {fetchUsers, handleDeleteUser} from "@api/usersApi";
import {Spin} from "antd";

const User = lazy(() => import("@pages/Admin/UserCard"));

export const AllUsersPage = () => {
    const [usersList, setUsersList] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers(setUsersList);
    }, []);

    return (
        <div id="container-for-content">
            <Spin spinning={usersList.length === 0}>
                <ul>
                    {usersList.map(user => (
                        <li key={user.id}>
                            <User userProps={user} onDelete={handleDeleteUser(user.id, setUsersList)}/>
                        </li>
                    ))}
                </ul>
            </Spin>
        </div>
    )
}