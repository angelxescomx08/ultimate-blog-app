import { useContext } from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react';
import { HiLogout } from 'react-icons/hi';
import { GlobalContext } from '~/context/GlobalContext';

const Header = () => {
    const { data: sessionData, status } = useSession()

    const { setIsWriteModalOpen } = useContext(GlobalContext)

    const logIn = async () => {
        await signIn()
    }

    const logOut = async () => {
        await signOut()
    }
    return (
        <header className='h-20 w-full flex flex-row justify-around items-center bg-white border-b-[1px] border-gray-300'>
            <div>
                <IoReorderThreeOutline className='text-2xl text-gray-600' />
            </div>
            <div className='font-thin text-xl'>Ultimate Blog App</div>
            {
                status === 'authenticated'
                    ? (<div className='flex items-center space-x-2'>
                        <div>
                            <BsBell className='text-2xl text-gray-600' />
                        </div>
                        <div>
                            <div className='w-5 h-5 bg-gray-600 rounded-full'></div>
                        </div>
                        <div>
                            <button onClick={() => { setIsWriteModalOpen(true) }} className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>
                                <div>Write</div>
                                <div>
                                    <FiEdit />
                                </div>
                            </button>
                        </div>
                        <div>
                            <button
                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                onClick={logOut}
                                className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>
                                <div>Logout</div>
                                <div>
                                    <HiLogout />
                                </div>
                            </button>
                        </div>
                    </div>)
                    : <div>
                        <button
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={logIn}
                            className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>

                            Signin
                        </button>
                    </div>
            }

        </header>
    )
}

export default Header