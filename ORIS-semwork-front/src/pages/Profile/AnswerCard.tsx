import type {Answer} from "@types/models";
import {type  FC, useState} from "react";
import {Link} from "react-router-dom";
import {useAppContext} from "../../AppContext";
import {dateFormat} from "@utils/dateFormat";
import {handleDeleteAnswer, handleEditAnswer, handleRemoveFavorites} from "@api/answersApi";
import {handleAddFavorites} from "../../api/answersApi";

interface Props {
    favoritesAnswers: Answer[];
    setFavoritesAnswers: (newState: Answer[]) => void;
    answer: Answer;
    onDelete?: (deletedId: number) => void;
}

export const AnswerCard: FC<Props> = ({favoritesAnswers, setFavoritesAnswers, answer, onDelete}) => {
    const {user} = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(answer.content);

    const isFavorite = favoritesAnswers?.some(fav => fav.id === answer.id);

    return (
        <section className="answer-card">
            <div className="container-for-answer-info">
                <Link className="question_title" to={`/question?id=${answer.question.id}`}>
                    <h2>{answer.question.title}</h2>
                </Link>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', width: '15vw',
                    alignItems: 'center'
                }}>
                    {isFavorite ? (
                        <button style={{width: '4vw', display: 'flex', justifyContent: 'center'}}
                                onClick={() => handleRemoveFavorites(answer.id, setFavoritesAnswers)}>
                            <img src="/icons/saved_icon_fill.svg" style={{height: '2.5vw', width: '2vw'}}/>
                        </button>
                    ) : (
                        <button style={{width: '4vw', display: 'flex', justifyContent: 'center'}}
                                onClick={() => handleAddFavorites(answer.id, setFavoritesAnswers)}>
                            <img src="/icons/saved_icon.svg" style={{height: '2.5vw', width: '2vw'}}/>
                        </button>
                    )}

                    {(user.role !== 'USER' || user.id === answer.author.id) && (
                        <>
                            <button style={{width: '4vw', display: 'flex', justifyContent: 'center'}}
                                    onClick={() => handleDeleteAnswer(answer.id, setFavoritesAnswers, onDelete)}>
                                <img src='/icons/trash-icon.svg' style={{height: '3vw', width: '3vw'}}/>
                            </button>
                            <button style={{width: '4vw', display: 'flex', justifyContent: 'center'}}
                                    onClick={() => setIsEditing(prev => !prev)}>
                                {isEditing ?
                                    <img style={{height: '3vw', width: '3vw'}} src="/icons/cancel.svg"/>
                                    :
                                    <img style={{height: '3vw', width: '3vw'}} src="/icons/pencil.svg"/>}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                <>
                    <textarea
                        className="answer_edit_textarea"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={4}
                        style={{width: '97.5%', margin: '1vw', padding: '1vw',
                            borderRadius: '2vw', border: 'var(--mint-color) solid 0.15vw'}}
                    />
                    <button onClick={() => handleEditAnswer(editedContent, answer, setIsEditing)} className="button" style={{marginLeft: '1vw'}}
                            disabled={!editedContent.trim()}>
                        edit
                    </button>
                </>
            ) : (
                <p className="answer_description">{answer.content}</p>
            )}

            <div className="container-for-rating">
                <p className="answer_author">author: {answer.author.username}</p>
                <p>published at: {dateFormat(answer.publishedAt)}</p>
            </div>
        </section>
    );
};