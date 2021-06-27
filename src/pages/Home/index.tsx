import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Modal from 'react-modal'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import logoImgDark from '../../assets/images/logo-dark.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import { Button } from '../../components/Button'
import { ThemeSwitcher } from '../../components/ThemeSwitcher'

import '../../styles/auth.scss'

import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'
import { useTheme } from '../../hooks/useTheme'

export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()
    const [ roomCode, setRoomCode ] = useState('')
    const [error, setError] = useState<string | undefined>()
    const { theme } = useTheme()

    async function handleCreateRoom() {
        if(!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    } 

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if(roomCode.trim() === '') {
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()) {
            setError('Essa sala não existe')
            return
        }

        if(roomRef.val().endedAt) {
            setError('Essa sala já está fechada')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return (
        <div id="page-auth" className={theme}>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas " />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire suas dúvidas da sua audênia em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    { theme === 'light' ? (
                        <img src={logoImg} alt="Letmeask" />
                    ) : (
                        <img src={logoImgDark} alt="Letmeask" />
                    )}
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo go Google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator">ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                        { error && (
                            <p className="message-error">{error}</p>
                        )}
                    </form>
                </div>
                <ThemeSwitcher />
            </main>
        </div>
    )
}