import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { MainLayout } from '~/layouts'
import { api } from '~/utils/api'
import { BiEdit } from 'react-icons/bi'
import { toast } from 'react-hot-toast'
import { SlShareAlt } from 'react-icons/sl'
import Post from '~/components/Post'
import { useSession } from 'next-auth/react'


const UserProfilePage = () => {

    const router = useRouter()

    const currentUser = useSession()

    const userProfile = api.auth.getUserProfile.useQuery({
        username: router.query.username as string
    }, { enabled: !!router.query.username })

    const userPosts = api.auth.getUserPost.useQuery({
        username: router.query.username as string
    }, { enabled: !!router.query.username })

    return (
        <MainLayout>
            <div className='w-full h-full flex items-center justify-center'>
                <div className='my-10 flex flex-col justify-center items-center xl:max-w-screen-lg lg:max-w-screen-md w-full h-full'>
                    <div className='bg-white rounded-3xl flex flex-col w-full shadow-md'>
                        <div className='relative h-44 bg-gradient-to-br w-full rounded-t-3xl from-rose-100 to-teal-100'>
                            <div className='absolute -bottom-10 left-12'>
                                <div className='group w-32 h-32 rounded-full relative border-white border-2 bg-gray-100 cursor-pointer'>
                                    {
                                        currentUser.data?.user.id === userProfile.data?.id
                                        && <label
                                            htmlFor='avatarFile'
                                            className={`cursor-pointer absolute flex items-center justify-center w-full h-full group-hover:bg-black/20 z-10 rounded-full transition`}>
                                            <BiEdit className='text-3xl hidden group-hover:block text-white' />
                                            <input
                                                type='file'
                                                name='avatarFile'
                                                id='avatarFile'
                                                className='sr-only'
                                                accept='image/*'
                                            />

                                        </label>
                                    }
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
                        <div className='mt-10 ml-12 flex flex-col space-y-0.5 rounded-b-3xl py-5'>
                            <div className='text-2xl font-semibold text-gray-800'>
                                {userProfile.data?.name}
                            </div>
                            <div className='text-gray-600'>
                                @{userProfile.data?.username}
                            </div>
                            <div className='text-gray-600'>
                                {userProfile.data?._count.posts ?? 0} Posts
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                        navigator.clipboard.writeText(window.location.href)
                                        toast.success('URL copied')
                                    }}
                                    className='mt-2 flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-3 px-4 py-2 border border-gray-200 active:scale-95 transform '>
                                    <div>Write</div>
                                    <div>
                                        <SlShareAlt />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='my-10 w-full'>
                        {
                            userPosts.isSuccess && userPosts.data?.posts.map((post) => (
                                <Post {...post} key={post.id} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default UserProfilePage