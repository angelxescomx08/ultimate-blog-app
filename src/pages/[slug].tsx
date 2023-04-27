import { useRouter } from 'next/router'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'
import { BsChat } from 'react-icons/bs'
import { MainLayout } from '~/layouts'
import { api } from '~/utils/api'
import { Fragment, useCallback, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiXMark } from 'react-icons/hi2'

const PostPage = () => {
    const router = useRouter()

    const postRoute = api.useContext().post;

    const post = api.post.getPost.useQuery({ slug: router.query.slug as string }, {
        //solo hacer la consulta cuando slug esta definido
        enabled: !!router.query.slug
    })

    const invalidateCurrentPostPage = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        postRoute.getPost.invalidate({ slug: router.query.slug as string })
    }, [])

    const likePost = api.post.likePost.useMutation({
        onSuccess: () => {
            invalidateCurrentPostPage()
        }
    })

    const dislikePost = api.post.dislikePost.useMutation({
        onSuccess: () => {
            invalidateCurrentPostPage()
        }
    })

    const [showCommentSidebar, setShowCommentSidebar] = useState(false)

    return (
        <MainLayout>

            <Transition.Root show={showCommentSidebar} as={Fragment}>
                <Dialog as="div" onClose={() => setShowCommentSidebar(false)}>
                    <div className='fixed right-0 top-0'>
                        <Transition.Child
                            enter='transition duration-1000'
                            leave='transition duration-500'
                            enterFrom='translate-x-full'
                            enterTo='translate-x-0'
                            leaveFrom='translate-x-0'
                            leaveTo='translate-x-full'
                        >
                            <Dialog.Panel className={'shadow-md relative w-[200px] sm:w-[400px] h-screen bg-white'}>
                                <div className='w-full h-full flex flex-col px-6 overflow-scroll'>
                                    <div className='flex justify-between px-3 mt-10 mb-6'>
                                        <h2 className='text-xl font-medium'>Responses ({4})</h2>
                                        <div>
                                            <HiXMark className='cursor-pointer' onClick={() => setShowCommentSidebar(false)} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <form className='w-full flex flex-col items-end space-y-4'>
                                        <textarea
                                            id="comment"
                                            rows={3}
                                            placeholder='Blog main text...'
                                            className='shadow-lg m-1 w-full outline-none p-4 rounded-xl'
                                        /* // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                                        {...register('text')} */
                                        />

                                        <button type='submit' className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>
                                            Comment
                                        </button>
                                    </form>
                                    <div className='flex flex-col space-y-4 justify-center items-center'>
                                        {
                                            Array.from({ length: 7 }).map((_, i) => (
                                                <div className='flex w-full flex-col space-y-2 border-b last:border-none border-gray-300 pb-4' key={i}>
                                                    <div className='flex w-full items-center space-x-2'>
                                                        <div className='w-10 h-10 bg-gray-400 rounded-full relative'>

                                                        </div>
                                                        <div>
                                                            <p className='font-semibold'>
                                                                Ángel Hdz
                                                            </p>
                                                            <p className=''>2 hours ago</p>
                                                        </div>
                                                    </div>
                                                    <div className='text-sx text-gray-600'>
                                                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa repudiandae recusandae modi impedit non nobis a nesciunt quae esse asperiores!
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {
                post.isLoading && <div className='w-full h-full flex justify-center items-center space-x-4'>
                    <div>
                        <AiOutlineLoading3Quarters className='animate-spin' />
                    </div>
                    <div>
                        Loading...
                    </div>
                </div>
            }

            {
                post.isSuccess && <div className='fixed bottom-10 w-full flex justify-center'>
                    <div className='group flex items-center space-x-4 rounded-full transition duration-300 px-6 py-3 bg-white border-[0.5px] border-gray-400 hover:border-gray-900'>
                        <div className='border-r pr-4 group-hover:border-gray-900 transition duration-300 cursor-pointer shadow-xl'>
                            {post.data?.likes && post.data?.likes.length > 0
                                ? <FcLike
                                    onClick={() => post.data?.id && dislikePost.mutate({
                                        postId: post.data?.id,
                                    })}
                                    className='text-xl'
                                />
                                : <FcLikePlaceholder
                                    onClick={() => post.data?.id && likePost.mutate({
                                        postId: post.data?.id,
                                    })}
                                    className='text-xl'
                                />}
                        </div>
                        <div>
                            <BsChat className='text-base cursor-pointer' onClick={() => {
                                setShowCommentSidebar(true)
                            }} />
                        </div>
                    </div>
                </div>
            }

            <div className='flex flex-col h-full w-full justify-center items-center p-10'>
                <div className='max-w-screen-lg w-full flex flex-col space-y-6'>
                    <div className='h-[60vh] relative w-full rounded-xl bg-gray-300 shadow-lg'>
                        <div className='absolute w-full h-full flex items-center justify-center'>
                            <div className='bg-gray-500 bg-opacity-50 rounded-xl p-4 text-white text-3xl'>
                                {post.data?.title}
                            </div>
                        </div>
                    </div>
                    <div className='border-l-4 border-gray-800 pl-6 '>
                        {post.data?.description}
                    </div>
                    <div>
                        {post.data?.text}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default PostPage