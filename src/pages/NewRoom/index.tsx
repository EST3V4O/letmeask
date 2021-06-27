import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import logoImgDark from '../../assets/images/logo-dark.svg'

import '../../styles/auth.scss'

import { Button } from '../../components/Button'
import { ThemeSwitcher } from '../../components/ThemeSwitcher'
import { database } from '../../services/firebase'
import { useTheme } from '../../hooks/useTheme'

export function NewRoom() {
    const { user } = useAuth()
    const history = useHistory()
    const [newRoom, setNewRoom] = useState('')
    const { theme } = useTheme()

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if(newRoom.trim() === '') {
            return
        }

        const roomRef = database.ref('rooms')

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar na sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link> </p>
                </div>
                <ThemeSwitcher />
            </main>
        </div>
    )
}