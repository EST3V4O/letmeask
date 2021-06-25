
import { ReactNode } from 'react'
import ex from 'classnames'

import './styles.scss'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children?: ReactNode,
    isAnswered?: boolean;
    isHiglighted?: boolean
}

export function Question({
    content,
    author,
    isAnswered = false,
    isHiglighted = false,
    children
}: QuestionProps) {
    return (
        <div
            className={ex(
                'question',
                { answered: isAnswered },
                { highlighted: isHiglighted && !isAnswered}
            )}
        >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    { children }
                </div>
            </footer>
        </div>
    )
}