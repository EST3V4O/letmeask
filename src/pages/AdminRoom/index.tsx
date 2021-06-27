import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Modal from 'react-modal'

import { useRoom } from '../../hooks/useRoom'
import { useAuth } from '../../hooks/useAuth'

import { database } from '../../services/firebase'

import logoImg from '../../assets/images/logo.svg'
import logoImgDark from '../../assets/images/logo-dark.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkedImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'


import { Button } from '../../components/Button'
import { ThemeSwitcher } from '../../components/ThemeSwitcher'
import { Spinner } from '../../components/Spinner'
import { EmptyQuestions } from '../../components/EmptyQuestions'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'

import '../../styles/room.scss'
import '../../styles/modal.scss'
import { useTheme } from '../../hooks/useTheme'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user, loading, handleFinishLoading } = useAuth()
    const { theme } = useTheme()
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id 

    const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>()
    const [endRoomModal, setEndRoomModal] = useState(false)
    
    const { questions, title } = useRoom(roomId)

    useEffect(() => {
       const roomRef = database.ref(`rooms/${roomId}`)
       roomRef.once('value', room => {
           const authorId = room.val().authorId
           const isEndedRoom = room.val().endedAt

           if(authorId !== user?.id) {
               history.push(`/rooms/${roomId}`)
               return
           }

           if(isEndedRoom) {
               history.push('/')
               return
           }
        })

       return () => {
           roomRef.off('value')
       }
    }, [user, history, roomId])

    useEffect(() => {
        handleFinishLoading()
    }, [handleFinishLoading])

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string | undefined) {
        if(!questionId) {
            return
        }

        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        setQuestionIdModalOpen(undefined)
    }
    
    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
           isAnswered: true 
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true 
         })
    }

    if(loading) {
        return (
            <Spinner loading/>
        )
    }

    return (
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    { theme === 'light' ? (
                        <img src={logoImg} alt="Letmeask" />
                    ) : (
                        <img src={logoImgDark} alt="Letmeask" />
                    )}
                    <div>
                        <RoomCode code={roomId}/>
                        <div>
                            <Button isOutlined onClick={() => setEndRoomModal(true)}>Encerar sala</Button>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && (
                        <span>{questions.length} pergunta(s)</span>
                    ) }
                </div>

                <div className="question-list">
                    { questions.length > 0 ? questions.map((question) => {
                        return (
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                { !question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkedImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque a pergunta" />
                                        </button>
                                    </>
                                ) }
                                <button
                                    type="button"
                                    onClick={() => setQuestionIdModalOpen(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    }) : (
                        <EmptyQuestions isAdmin />
                    ) }
                    <Modal
                        isOpen={questionIdModalOpen !== undefined}
                        className={`modal ${theme}`}
                        onRequestClose={() => setQuestionIdModalOpen(undefined)}
                    >
                        <div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5.99988H5H21" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                            <div>
                                <h3>Excluir pergunta</h3>
                                <p>Tem certeza que você deseja excluir esta pergunta?</p>
                            </div>
                            <div>
                                <Button forCancel onClick={() => setQuestionIdModalOpen(undefined)}>
                                    Cancelar
                                </Button>
                                <Button forDelete onClick={() => handleDeleteQuestion(questionIdModalOpen)}>
                                    Sim, excluir
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </main>
            <Modal
                className={`modal ${theme}`}
                isOpen={endRoomModal}
                onRequestClose={() => setEndRoomModal(false)}
            >
                <div>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.66 18.3398L18.34 29.6598" stroke="#DBDCDD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M29.66 29.6598L18.34 18.3398" stroke="#DBDCDD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z" stroke="#DBDCDD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>


                    <div>
                        <h3>Encerrar sala</h3>
                        <p>Tem certeza que você deseja encerrar esta sala?</p>
                    </div>
                    <div>
                        <Button forCancel onClick={() => setEndRoomModal(false)}>
                            Cancelar
                        </Button>
                        <Button forDelete onClick={handleEndRoom}>
                            Sim, encerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}