import {useEffect, useState} from "react";
import type {Category, Question} from "@types/models";
import {QuestionCard} from "@pages/Profile/QuestionCard";
import {useAppContext} from "../../AppContext";
import axiosConfig from "../../axiosConfig";
import {handleAddQuestion} from "@api/questionsApi";
import {useForm} from "react-hook-form";

export const MyQuestionsPage = () => {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [myQuestionsList, setMyQuestionsList] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {user} = useAppContext();

    const {register, handleSubmit, reset} = useForm({
        defaultValues: {
            title: "",
            content: "",
            category: ""
        }
    });

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
                      onSubmit={handleSubmit((data) => handleAddQuestion(data, user.id, setMyQuestionsList, categoriesList, reset))}>
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <br/>
                        <input type="text"
                               id="title" required
                               {...register("title")} disabled={isLoading}/>
                        <select {...register("category")} style={{marginLeft: "30px"}}
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
                        <textarea id="description"
                                  required disabled={isLoading}
                                  {...register("content")}/>
                    </div>
                    <br/>
                    <button type="submit" className="button"
                            disabled={isLoading}>{isLoading ? 'Submiting...' : 'Submit'}
                    </button>
                </form>
            </section>
            <ul>
                {myQuestionsList.length == 0 ?
                    <p>There is nothing here yet</p>
                    :
                    myQuestionsList.map(question => (
                        <li key={question.id}>
                            <QuestionCard question={question}/>
                        </li>
                    ))}
            </ul>
        </div>
    );
};