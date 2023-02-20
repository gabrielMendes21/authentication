import { AuthContext } from "@/contexts/AuthContext"
import { useContext, useState } from "react"
import { Fade } from 'react-reveal'
import { destroyCookie, parseCookies } from 'nookies'
import Router from "next/router"
import Modal from 'react-modal'

Modal.setAppElement('#__next')

export default function Home() {
    const { user } = useContext(AuthContext)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false); 

    function handleSignOut() {
        destroyCookie(undefined, 'auth-token')
        Router.reload()
    }

    return (
        <div className="h-screen w-screen">
            <Fade>
                <header className="p-3">
                    <nav className="text-2xl font-medium">
                        <ul className="flex gap-5">
                            <li onClick={handleOpenModal} className="cursor-pointer">Account</li>
                            <li onClick={handleSignOut} className="text-red-500 cursor-pointer">Log out</li>
                        </ul>
                    </nav>
                </header>

                <Fade>
                    <Modal 
                        overlayClassName="bg-black/60 inset-0 fixed"
                        className='bg-transparent'
                        isOpen={isModalOpen}
                        onRequestClose={handleCloseModal}
                    >
                        <div className="fixed w-max bg-zinc-200 py-7 px-7 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm shadow-lg shadow-black/25">
                            <h1 className="text-xl md:text-3xl font-black mb-5">Account data</h1>
                            <div className="flex flex-col gap-2 font-medium">
                                <span>Name: {user?.name}</span>
                                <hr className="bg-black" />
                                <span>Email: {user?.email}</span>
                            </div>

                            <button 
                                onClick={handleCloseModal}
                                type="button" 
                                className="bg-red-500 px-3 py-2 mt-5 rounded-md hover:bg-red-600 transition aboslute right-0"
                            >
                                Close
                            </button>
                        </div>
                    </Modal>
                </Fade>
            
                <main className="h-5/6 flex justify-center items-center">
                    {
                        user ?
                        <div>
                            <h1 className="bg-black text-white text-center p-3 rounded-lg text-6xl">Olá, {user?.name}!</h1>
                        </div> :
                        null
                    }
                </main>
            </Fade>
        </div>
    )
}

export const getServerSideProps = (ctx) => {
    const { 'auth-token': token } = parseCookies(ctx)

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}