import axiosConfig from "../axiosConfig";
import {Category, Question, type Reward} from "@types/models";
import {ShowRewardModal} from "@components/ShowRewardModal";

export const handleIncrementViews = async (questionId: number) => {
    try {
        await axiosConfig.post(`questions/incrementCountViews/${questionId}`)
    } catch (error) {
        alert(error.message)
    }
}

export const fetchGetQuestion = async (questionId: number, setCurrentQuestion: (newValue: Question) => void) => {
    try {
        const response = await axiosConfig.get(`/questions/byId/${questionId}`)
        setCurrentQuestion(response.data);
    } catch (error) {
        console.error("Ошибка при получении вопроса:", error);
        setCurrentQuestion(null);
    }
}


export const handleAddQuestion = async (e: React.FormEvent, userId: number,
                                        titleRef, contentRef, categoryRef,
                                        setMyQuestionsList: (newValue: Question[]) => void, categoriesList: Category[]) => {
    e.preventDefault();

    if (!titleRef.current || !contentRef.current || !categoryRef.current) {
        return;
    }

    const newQuestion = {
        title: titleRef.current.value,
        content: contentRef.current.value,
        category: categoryRef.current.value
    };

    try {
        const resp = await axiosConfig.post('/questions/create', newQuestion);
        const reward: Reward = resp.data;

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

        const response = await axiosConfig.get(`/questions/byAuthorId/${userId}`);
        setMyQuestionsList(response.data);

        titleRef.current.value = "";
        contentRef.current.value = "";
        if (categoriesList.length > 0) {
            categoryRef.current.value = categoriesList[0].name;
        }
    } catch (error) {
        alert(`Error with create question: ${error}`);
    }
};