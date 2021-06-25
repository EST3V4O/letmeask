import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import { useAuth } from "./useAuth"

import { database } from "../services/firebase"

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean
    likes: Record<string, {
        authorId: string
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined
}

export function useRoom(roomId: string) {
    const { user } = useAuth()
    const history = useHistory()
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.once('value', room => {
            const isEndedRoom = room.val().endedAt

            if(isEndedRoom) {
                history.push('/')
            }
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, history])

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)

            return () => {
                roomRef.off('value')
            }
        })
    }, [roomId, user?.id])

    return { questions, title }

}