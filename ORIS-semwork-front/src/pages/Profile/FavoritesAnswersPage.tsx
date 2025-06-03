import {AnswerCard} from "@pages/Profile/AnswerCard";
import {useEffect, useState} from "react";
import {Answer} from "@types/models";
import axiosConfig from "../../axiosConfig";

export const FavoritesAnswersPage = () => {
    const [favoritesAnswers, setFavoritesAnswers] = useState<Answer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchFavorites = async () => {
        setIsLoading(true);
        try {
            const response = await axiosConfig.get('/answers/favorites/all');
            setFavoritesAnswers(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error.response?.data);

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <div id="container-for-content">
            {isLoading ? (
                <p>Загрузка</p>
            ) : favoritesAnswers.length === 0 ? (
                <p>пока что тут пусто</p>
            ) : (
                <ul>
                    {favoritesAnswers.map(answer => (
                        <li key={answer.id}>
                            <AnswerCard
                                answer={answer}
                                favoritesAnswers={favoritesAnswers}
                                setFavoritesAnswers={setFavoritesAnswers}
                                onDelete={(deletedId) =>
                                    setFavoritesAnswers(prev =>
                                        prev.filter(ans => ans.id !== deletedId)
                                    )
                                }
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};