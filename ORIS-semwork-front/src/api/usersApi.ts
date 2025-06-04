import axiosConfig from "../axiosConfig";
import {User} from "@types/models";
import {type NavigateFunction} from "react-router-dom";

export const fetchAvatar = async (setAvatarUrl: (newValue: string) => void) => {
    try {
        const response = await axiosConfig.get('/files/get/avatar', {responseType: 'blob'})

        const url: string = URL.createObjectURL(response.data);
        setAvatarUrl(url);
    } catch (error) {
        // alert(`Error loading image: ${error}`)
    }
}

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

export const logout = async (navigate: NavigateFunction, setUser: (newValue: User) => void) => {
    try {
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name.trim()}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        });
        sessionStorage.removeItem('user');
        navigate('/');
        setUser(null);
    } catch (err) {
        console.error('Logout error:', err);
    }
};

export const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFile, setPreview) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
};
