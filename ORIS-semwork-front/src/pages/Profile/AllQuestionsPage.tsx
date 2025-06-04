import {QuestionCard} from "@pages/Profile/QuestionCard";
import {useEffect, useMemo, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import type {Category, Question} from "@types/models";
import {fetchCategories} from "@api/categoriesApi";
import {fetchQuestions} from "@api/questionsApi";

export const AllQuestionsPage = () => {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [questionsList, setQuestionsList] = useState<Question[] | undefined>([]);

    const location = useLocation();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const categoryParam = queryParams.get('category');

    useEffect(() => {
        Promise.allSettled([
            fetchCategories(setCategoriesList),
            fetchQuestions(categoryParam, setQuestionsList)
        ])
    }, [categoryParam]);

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
                            There is nothing here yet
                        </div>
                        :
                        <ul>
                            {questionsList.map(question => (
                                <li key={question.id}>
                                    <QuestionCard question={question}/>
                                </li>
                            ))}
                        </ul>) :
                <p>There are no questions in this category yet</p>
            }
        </div>
    );
};