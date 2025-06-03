import {AnswerCard} from "@pages/Profile/AnswerCard";
import {useEffect, useMemo, useRef, useState} from "react";
import type {Question, Answer} from "@types/models";
import {useLocation} from "react-router-dom";
import {NotFoundPage} from "@pages/Errors/NotFoundPage";
import {dateFormat} from "@utils/dateFormat";
import {fetchAnswersForQuestion, fetchFavorites, handleAddAnswer} from "@api/answersApi";
import {fetchGetQuestion} from "@api/questionsApi";
//
//
// export const QuestionPage = () => {
//     const [allAnswersForThisQuestion, setAllAnswersForThisQuestion] = useState<Answer[]>([]);
//     const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
//     const contentRef = useRef<HTMLInputElement>(null);
//
//     const [favoritesAnswers, setFavoritesAnswers] = useState<Answer[]>([]);
//
//     const location = useLocation();
//     const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
//     const questionParam = queryParams.get("id");
//     const questionId = Number(questionParam);
//
//     useEffect(() => {
//         if (questionParam === null || isNaN(questionId)) {
//             setCurrentQuestion(null);
//             return;
//         }
//
//         Promise.allSettled([
//             fetchGetQuestion(questionId, setCurrentQuestion),
//             fetchAnswersForQuestion(questionId, setAllAnswersForThisQuestion),
//             fetchFavorites(setFavoritesAnswers)
//         ])
//     }, [questionParam]);
//
//
//     if (isNaN(questionId) || !currentQuestion) return <NotFoundPage/>;
//
//     return (
//         <div id="container-for-content">
//             <ul>
//                 <li key={`question-${questionId}`}>
//                     <section className="question-card">
//                         <div className="container-for-question-title">
//                             <h2 className="question_title">{currentQuestion.title}</h2>
//                             <p className="category">category: {currentQuestion.category.name}</p>
//                         </div>
//                         <p className="question_content">{currentQuestion.content}</p>
//                         <div style={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             width: '100%',
//                             alignItems: 'center'
//                         }}>
//                             <p>published at: {dateFormat(currentQuestion.publishedAt)}</p>
//                             <p style={{alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
//                                 <p className="question_author">author: <span>{currentQuestion.author.username}</span></p>
//                                 <strong style={{
//                                     alignItems: 'center',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     width: '60px',
//                                     opacity: '0.65'
//                                 }}>
//                                     <img src='icons/eye-icon.svg' style={{height: '25px', marginRight: '-2.1vw'}}/>
//                                     {currentQuestion.countViews}
//                                 </strong>
//                             </p>
//                         </div>
//                     </section>
//                 </li>
//
//                 <section className="form-to-send-answer">
//                     <h2> Add an answer:</h2>
//                     <form onSubmit={(e) => handleAddAnswer(e, contentRef, questionId, setAllAnswersForThisQuestion)}
//                           style={{width: '100%'}}>
//                         <div className="form-group" style={{width: '100%'}}>
//                             <input type="text" id="answer" required ref={contentRef}
//                                    placeholder="Answer the question here"/>
//                         </div>
//                         <br/>
//                         <button className="button" style={{width: '100%'}}>Send</button>
//                     </form>
//                 </section>
//
//                 {allAnswersForThisQuestion.map((answer) => (
//                     <li key={answer.id}>
//                         <AnswerCard
//                             answer={answer}
//                             favoritesAnswers={favoritesAnswers}
//                             setFavoritesAnswers={setFavoritesAnswers}
//                             onDelete={(deletedId) => setAllAnswersForThisQuestion(prev => prev.filter(ans => ans.id !== deletedId))}
//                         />
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
export const QuestionPage = () => {
    const [allAnswersForThisQuestion, setAllAnswersForThisQuestion] = useState<Answer[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const contentRef = useRef<HTMLInputElement>(null);

    const [favoritesAnswers, setFavoritesAnswers] = useState<Answer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const questionParam = queryParams.get("id");
    const questionId = Number(questionParam);

    useEffect(() => {
        if (questionParam === null || isNaN(questionId)) {
            setCurrentQuestion(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        Promise.allSettled([
            fetchGetQuestion(questionId, setCurrentQuestion),
            fetchAnswersForQuestion(questionId, setAllAnswersForThisQuestion),
            fetchFavorites(setFavoritesAnswers)
        ]).finally(() => setIsLoading(false));
    }, [questionParam]);

    if (isNaN(questionId) || (!isLoading && !currentQuestion)) return <NotFoundPage/>;

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                width: '100%'
            }}>
                <div style={{
                    width: '4vw',
                    height: '4vw',
                    border: '0.4vw solid #ccc',
                    borderTop: '0.4vw solid var(--primary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}/>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
            </div>
        );
    }

    return (
        <div id="container-for-content">
            <ul>
                <li key={`question-${questionId}`}>
                    <section className="question-card">
                        <div className="container-for-question-title">
                            <h2 className="question_title">{currentQuestion.title}</h2>
                            <p className="category">category: {currentQuestion.category.name}</p>
                        </div>
                        <p className="question_content">{currentQuestion.content}</p>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center'
                        }}>
                            <p>published at: {dateFormat(currentQuestion.publishedAt)}</p>
                            <p style={{alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
                                <p className="question_author">
                                    author: <span>{currentQuestion.author.username}</span>
                                </p>
                                <strong style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '60px',
                                    opacity: '0.65'
                                }}>
                                    <img src='icons/eye-icon.svg' style={{height: '25px', marginRight: '-2.1vw'}}/>
                                    {currentQuestion.countViews}
                                </strong>
                            </p>
                        </div>
                    </section>
                </li>

                <section className="form-to-send-answer">
                    <h2> Add an answer:</h2>
                    <form onSubmit={(e) => {
                        setIsSubmitting(true);
                        handleAddAnswer(e, contentRef, questionId, setAllAnswersForThisQuestion)
                            .finally(() => setIsSubmitting(false));
                    }} style={{width: '100%'}}>
                        <div className="form-group" style={{width: '100%'}}>
                            <input type="text" id="answer" required ref={contentRef}
                                   placeholder="Answer the question here"/>
                        </div>
                        <br/>
                        <button className="button" style={{width: '100%'}} disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </section>

                {allAnswersForThisQuestion.map((answer) => (
                    <li key={answer.id}>
                        <AnswerCard
                            answer={answer}
                            favoritesAnswers={favoritesAnswers}
                            setFavoritesAnswers={setFavoritesAnswers}
                            onDelete={(deletedId) => setAllAnswersForThisQuestion(prev => prev.filter(ans => ans.id !== deletedId))}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
