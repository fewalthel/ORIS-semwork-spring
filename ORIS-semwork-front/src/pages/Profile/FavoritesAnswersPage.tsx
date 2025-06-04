import {AnswerCard} from "@pages/Profile/AnswerCard";
import {useEffect, useState} from "react";
import {Answer} from "@types/models";
import {fetchFavorites} from "@api/answersApi";

export const FavoritesAnswersPage = () => {
    const [favoritesAnswers, setFavoritesAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        (async () =>
                fetchFavorites(setFavoritesAnswers)
        )()
    }, []);

    return (
        <div id="container-for-content">
            {favoritesAnswers.length === 0 ? (
                <p style={{width: '100%', textAlign: 'center', marginTop: '20%'}}>There is nothing here yet</p>
            ) : (
                <ul>
                    {favoritesAnswers.map(answer => (
                        <li key={answer.id}>
                            <AnswerCard
                                answer={answer}
                                favoritesAnswers={favoritesAnswers}
                                setFavoritesAnswers={setFavoritesAnswers}
                                onDelete={(deletedId: number) =>
                                    setFavoritesAnswers((prev: Answer[]) =>
                                        prev.filter((ans: Answer) => ans.id !== deletedId)
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