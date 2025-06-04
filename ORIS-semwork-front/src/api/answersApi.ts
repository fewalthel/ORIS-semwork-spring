import axiosConfig from "../axiosConfig";
import {Answer} from "@types/models";
import {ShowRewardModal} from "@components/ShowRewardModal";

export const handleDeleteAnswer = async (
    answerId: number,
    setFavoritesAnswers: (newValue: Answer[]) => void,
    onDelete,
    setIsDeleting: (val: boolean) => void
) => {
    try {
        setIsDeleting(true);
        const response = await axiosConfig.post(`/answers/delete/${answerId}`);
        console.log(response.data);
        setFavoritesAnswers(prev => prev.filter(item => item.id !== answerId));
        if (onDelete) onDelete(answerId);
    } catch (error) {
        alert(`Error with delete answer: ${error.message}`);
    } finally {
        setIsDeleting(false);
    }
};

export const handleRemoveFavorites = async (
    answerId: number,
    setFavoritesAnswers: (newValue: Answer[]) => void,
    setIsRemovingFavorite: (val: boolean) => void
) => {
    try {
        setIsRemovingFavorite(true);
        await axiosConfig.post(`/answers/favorites/delete/${answerId}`);
        setFavoritesAnswers(prev => prev.filter(item => item.id !== answerId));
    } catch (error) {
        alert('error');
    } finally {
        setIsRemovingFavorite(false);
    }
};

export const handleAddFavorites = async (
    answerId: number,
    setFavoritesAnswers: (newValue: Answer[]) => void,
    setIsAddingFavorite: (val: boolean) => void
) => {
    try {
        setIsAddingFavorite(true);
        const response = await axiosConfig.post(`/answers/favorites/add/${answerId}`);
        const newFavorite: Answer = response.data;

        setFavoritesAnswers(prev => [...prev, newFavorite]);
    } catch (error) {
        alert('error');
    } finally {
        setIsAddingFavorite(false);
    }
};


export const fetchFavorites = async (setFavoritesAnswers: (newValue: Answer[]) => void) => {
    try {
        const response = await axiosConfig.get('/answers/favorites/all');
        setFavoritesAnswers(response.data);
    } catch (error) {
        alert(error.response?.data);
    }
};

export const handleEditAnswer = async (editedContent, answer: Answer, setIsEditing) => {
    if (!editedContent.trim()) return;
    try {
        await axiosConfig.post(`/answers/${answer.id}/edit`, {content: editedContent});
        answer.content = editedContent;
        setIsEditing(false);
    } catch (error) {
        alert('error');
    }
};

export const fetchAnswersForQuestion = async (questionId: number, setAllAnswersForThisQuestion) => {
    try {
        const response = await axiosConfig.get(`/answers/all/${questionId}`)
        setAllAnswersForThisQuestion(response.data);
    } catch (error) {
        console.error("Ошибка при получении ответов:", error);
    }
}

export const handleAddAnswer = async (e: React.FormEvent, contentRef: React.RefObject<HTMLInputElement>,
                                      questionId: number, setAllAnswersForThisQuestion: (newValue: Answer[]) => void) => {
    e.preventDefault();
    const content = contentRef.current?.value;
    if (!content) return;

    try {
        const resp = await axiosConfig.post("/answers/create", {content, questionId,});
        const reward = resp.data;

        if (reward) {
            try {
                const imageResponse = await axiosConfig.get('files/get/rewardImage/' + reward.id, {
                    responseType: 'blob'
                });
                const imageURL = URL.createObjectURL(imageResponse.data);
                ShowRewardModal(reward, imageURL);
            } catch (imageError) {
                console.error("Ошибка при загрузке изображения награды:", imageError);
                ShowRewardModal(reward, '');
            }
        }

        const response = await axiosConfig.get(`/answers/all/${questionId}`);
        setAllAnswersForThisQuestion(response.data);
        if (contentRef.current) contentRef.current.value = "";

    } catch (error) {
        alert('something went wrong. try again.')
    }
};