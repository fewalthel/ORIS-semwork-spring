import type {User} from "@types/models";
import {useEffect, useState} from "react";
import {fetchUsers, handleDeleteUser} from "@api/usersApi";
import {Spin} from "antd";
import {AdminMenuHeader} from "@pages/Admin/AdminMenuHeader";
import UserCard from "@pages/Admin/UserCard";


export const AllUsersPage = () => {
    const [usersList, setUsersList] = useState<User[]>([]);

    useEffect(() => {
        (async () => fetchUsers(setUsersList))()
    }, []);

    return (
        <div id="container-for-content">
            <AdminMenuHeader/>
            <Spin spinning={usersList.length === 0}>
                <ul>
                    {usersList.map(user => (
                        <li key={user.id}>
                            <UserCard userProps={user} onDelete={() => handleDeleteUser(user.id, setUsersList)}/>
                        </li>
                    ))}
                </ul>
            </Spin>
        </div>
    )
}