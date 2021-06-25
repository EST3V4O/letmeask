import emptyQuestionsImg from '../../assets/images/empty-questions.svg'

import './styles.scss'

type EmptyQuestionsProps = {
  isAdmin?: boolean;
}

export function EmptyQuestions({ isAdmin }: EmptyQuestionsProps) {
  return (
    <div className={`empty-questions ${isAdmin && 'admin'}`}>
        <img src={emptyQuestionsImg} alt="Perguntas vazias" />
        <h4>Nenhuma pergunta por aqui...</h4>
        <p>Envie o código desta sala para seus amigos e <br />
            comece a responder perguntas!
        </p>
    </div>
  )
}