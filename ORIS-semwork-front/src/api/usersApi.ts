import axiosConfig from "../axiosConfig";
import {User} from "@types/models";

export const fetchUsers = async (setUsersList: (newValue: User[]) => void) => {
    try {
        const response = await axiosConfig.get('/admin/users/all')
        setUsersList(response.data);
    } catch (error) {
        alert(`Error with loading users: ${error.message}`)
    }
};

export const handleDeleteUser = async (id: number, setUsersList: (newValue: User[]) => void) => {
    try {
        await axiosConfig.post(`/admin/delete/user/${id}`);
        setUsersList(prev => prev.filter(user => user.id !== id));
    } catch (error) {
        alert(`Error with delete user: ${error.message}`)
    }
};

export const handleUpdateRole = async (id: number, newRole: string, setRole: (newValue: string) => void) => {
    try {
        await axiosConfig.post(`admin/update/user/${newRole}/${id}`);
        setRole(newRole);
    } catch (error) {
        alert(`Error with update user role: ${error.message}`)
    }
};