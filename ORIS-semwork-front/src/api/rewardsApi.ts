import axiosConfig from "../axiosConfig";
import {Reward} from "@types/models";

export const fetchImage = async (rewardId: number, setImageUrl: (newValue: string) => void) => {
    try {
        const response = await axiosConfig.get(`/files/get/rewardImage/${rewardId}`, {responseType: 'blob'})

        const url: string = URL.createObjectURL(response.data);
        setImageUrl(url);
    } catch (error) {
        alert(`Error loading image: ${error}`)
    }
}

export const fetchUserRewards = async (setRewardsList: (newValue: Reward[]) => void, userId: number) => {
    try {
        const response = await axiosConfig.get(`/rewards/all/forUser/${userId}`);
        setRewardsList(response.data);
    } catch (error) {
        alert(`Error loading rewards: ${error}`);
    }
};

export const fetchAllRewards = async (setRewardsList: (newValue: Reward[]) => void) => {
    try {
        const response = await axiosConfig.get('/rewards/all');
        setRewardsList(response.data);
        console.log(response.data)
    } catch (error) {
        console.error('Ошибка при загрузке наград:', error);
    }
};