import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { MainLayout } from '~/layouts'
import { api } from '~/utils/api'
import { BiEdit } from 'react-icons/bi'

const UserProfilePage = () => {

    const router = useRouter()
    const userProfile = api.auth.getUserProfile.useQuery({
        username: router.query.username as string
    }, { enabled: !!router.query.username })

    return (
        <MainLayout>
            <div className='w-full h-full flex items-center justify-center'>
                <div className='my-10 flex flex-col justify-center items-center xl:max-w-screen-lg lg:max-w-screen-md w-full h-full'>
                    <div className='relative h-44 bg-gradient-to-br w-full rounded-3xl from-rose-100 to-teal-100'>
                        <div className='absolute -bottom-10 left-12'>
                            <div className='group w-32 h-32 rounded-full relative border-white border-2 bg-gray-100 cursor-pointer'>
                                <label htmlFor='avatarFile' className='cursor-pointer absolute flex items-center justify-center w-full h-full group-hover:bg-black/20 z-10 rounded-full transition'>
                                    <BiEdit className='text-3xl hidden group-hover:block text-white' />
                                    <input
                                        type='file'
                                        name='avatarFile'
                                        id='avatarFile'
                                        className='sr-only'
                                        accept='image/*'
                                    />
                                </label>
                                {
                                    userProfile.data?.image &&
                                    <Image
                                        className='rounded-full'
                                        src={userProfile.data?.image}
                                        alt={userProfile.data?.name ?? ''}
                                        fill
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        Post
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default UserProfilePage