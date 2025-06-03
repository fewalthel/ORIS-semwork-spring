import {QuestionCard} from "@pages/Profile/QuestionCard";
import {useEffect, useMemo, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import type {Category, Question} from "@types/models";
import axiosConfig from "../../axiosConfig";
import {useAppContext} from "../../AppContext";

export const AllQuestionsPage = () => {
    const {user} = useAppContext()

    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [questionsList, setQuestionsList] = useState<Question[] | undefined>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const categoryParam = queryParams.get('category');

    console.log('USER: \n' + user)

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const categoriesResponse = await axiosConfig.get('/categories/all');
            setCategoriesList(categoriesResponse.data);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchQuestions = async () => {
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

    useEffect(() => {
        (async () => {
            await fetchCategories();
            await fetchQuestions();
        })()
    }, [categoryParam]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div id="container-for-content">
            <div className="menu-card">
                <h1>Questions by categories</h1>
                <nav className="questions_categories_container">
                    <Link to="/all_questions">All questions</Link>

                    {categoriesList.map(category => (
                        <Link key={category.name}
                              to={`/all_questions?category=${category.name}`}>
                            {category.name}
                        </Link>
                    ))}
                </nav>
            </div>
            {questionsList ? (

                    questionsList.length == 0 ?
                        <div id="container-for-content" style={{
                            display: "flex", justifyContent: "center", alignItems: "center",
                            margin: 0, padding: 0, marginTop: '15%'
                        }}>
                            пока что тут ничего нет
                        </div>
                        :
                        <ul>
                            {questionsList.map(question => (
                                <li key={question.id}>
                                    <QuestionCard question={question}/>
                                </li>
                            ))}
                        </ul>) :
                <p>вопросов по этой категории пока нет</p>
            }
        </div>
    );
};