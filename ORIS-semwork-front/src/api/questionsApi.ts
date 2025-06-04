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

export const handleAddQuestion = async (
    data: { title: string; content: string; category: string },
    userId: number,
    setMyQuestionsList: (newValue: Question[]) => void,
    categoriesList: Category[],
    reset: () => void
) => {
    const newQuestion = {
        title: data.title,
        content: data.content,
        category: data.category
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

        reset();
    } catch (error) {
        alert(`Error with create question: ${error}`);
    }
};

export const fetchQuestions = async (
    categoryParam: string | null,
    setQuestionsList: (newValue: Question[] | undefined) => void
) => {
    try {
        const url = categoryParam
            ? `/questions/byCategory/${categoryParam}`
            : '/questions/all';

        const questionsResponse = await axiosConfig.get(url)
        setQuestionsList(questionsResponse.data);
    } catch (error) {
        if (error.status == 404) {
            setQuestionsList(undefined);
        }
    }
}