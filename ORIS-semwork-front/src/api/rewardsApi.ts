import axiosConfig from "../axiosConfig";

export const fetchImage = async (rewardId: number ,setImageUrl: (newValue: string) => void) => {
    try {
        const response = await axiosConfig.get(`/files/get/rewardImage/${rewardId}`, {responseType: 'blob'})

        const url: string = URL.createObjectURL(response.data);
        setImageUrl(url);
    } catch (error) {
        alert(`Error loading image: ${error}`)
    }
}