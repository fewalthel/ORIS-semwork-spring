import type {Question} from "@types/models";
import {Link} from "react-router-dom";
import type {FC} from "react";
import {dateFormat} from "@utils/dateFormat";
import {handleIncrementViews} from "@api/questionsApi";

interface Props {
    question: Question
}

export const QuestionCard: FC<Props> = ({question}: Props) => {

    return (
        <>
            <section className="question-card">
                <div className="container-for-question-title">
                    <Link className="question_title" to={"/question?id=" + question.id}
                          onClick={handleIncrementViews(question.id)}
                    ><h2>{question.title}</h2></Link>
                    <p className="category">category: {question.category.name}</p>
                </div>
                <p className="question_content">{question.content}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <p>published at: {dateFormat(question.publishedAt)}</p>
                    <p style={{alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
                        <p className="question_author">author: {question.author.username}</p>
                        <strong style={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '60px',
                            opacity: '0.65'
                        }}>
                            <img src='icons/eye-icon.svg' style={{height: '25px', marginRight: '-2.1vw'}}/>
                            {question.countViews}
                        </strong>
                    </p>
                </div>
            </section>
        </>
    )
}