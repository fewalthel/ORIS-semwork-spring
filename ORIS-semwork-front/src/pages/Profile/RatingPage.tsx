import axiosConfig from "../../axiosConfig";
import {useEffect, useState} from "react";
import {User} from "@types/models";

export const RatingPage = () => {
    const [ratingUsers, setRatingUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await axiosConfig.get('/get/sorted-by-rewards');
            setRatingUsers(response.data)
            console.log(response.data);
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div id="container-for-content">
            <h1>Rating of the most activity users</h1>
            <table id="table">
                <thead style={{background: 'var(--mint-color)'}}>
                <tr>
                    <td>number</td>
                    <td>username</td>
                    <td>total rewards</td>
                    <td>answers rewards</td>
                    <td>questions rewards</td>
                </tr>
                </thead>
                <tbody>
                {ratingUsers.map((user: User, index: number) => (
                    <tr key={user.id || index}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.rewards?.length}</td>
                        <td>{user.rewards?.filter(reward => reward.type === 'ANSWER').length}</td>
                        <td>{user.rewards?.filter(reward => reward.type === 'QUESTION').length}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}