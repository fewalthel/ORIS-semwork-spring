import {useEffect, useRef, useState} from "react";
import type {Category, Question} from "@types/models";
import {QuestionCard} from "@pages/Profile/QuestionCard";
import {useAppContext} from "../../AppContext";
import axiosConfig from "../../axiosConfig";
import {handleAddQuestion} from "@api/questionsApi";

export const MyQuestionsPage = () => {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [myQuestionsList, setMyQuestionsList] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {user} = useAppContext();

    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [categoriesResponse, questionsResponse] = await Promise.all([
                    axiosConfig.get("/categories/all"),
                    axiosConfig.get(`/questions/byAuthorId/${user?.id}`)
                ]);

                setCategoriesList(categoriesResponse.data);
                setMyQuestionsList(questionsResponse.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);


    return (
        <div id="container-for-content">
            <section className="form-to-send-question">
                <h2>Ask your question to other peers here</h2>
                <br/>

                <form id="send-question-form"
                      onSubmit={handleAddQuestion(user.id, titleRef, contentRef, categoryRef, setMyQuestionsList, categoriesList)}>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <br/>
                        <input type="text"
                               id="title" required
                               ref={titleRef} disabled={isLoading}/>
                        <select ref={categoryRef} style={{marginLeft: "30px"}}
                                disabled={isLoading || categoriesList.length === 0}>
                            {categoriesList.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <br/>
                        <label htmlFor="description">Content:</label>
                        <br/>
                        <textarea id="description" ref={contentRef}
                                  required disabled={isLoading}/>
                    </div>
                    <br/>
                    <button type="submit" className="button"
                            disabled={isLoading}>{isLoading ? 'Отправка...' : 'Submit'}
                    </button>
                </form>
            </section>
            <ul>
                {myQuestionsList.length == 0 ? <p>пока что тут пусто</p> :
                    myQuestionsList.map(question => (
                        <li key={question.id}>
                            <QuestionCard question={question}/>
                        </li>
                    ))}
            </ul>
        </div>
    );
};