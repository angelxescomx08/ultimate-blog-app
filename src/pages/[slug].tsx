import { useRouter } from 'next/router'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'
import { BsChat } from 'react-icons/bs'
import { MainLayout } from '~/layouts'
import { api } from '~/utils/api'
import { useCallback, useState } from 'react'
import CommentSidebar from '~/components/CommentSidebar'
import { BiImageAdd } from 'react-icons/bi'
import UnsplashGallery from '~/components/UnsplashGallery'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Interweave } from 'interweave'

const PostPage = () => {
    const router = useRouter()
    const { data } = useSession()
    const postRoute = api.useContext().post;

    const post = api.post.getPost.useQuery({ slug: router.query.slug as string }, {
        //solo hacer la consulta cuando slug esta definido
        enabled: !!router.query.slug,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

        queryKey: ['post.getPost', { slug: router.query.slug as string }]
    })

    const invalidateCurrentPostPage = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        postRoute.getPost.invalidate({ slug: router.query.slug as string })
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const [isOpenUnsplashModal, setIsOpenUnsplashModal] = useState(false)

    return (
        <MainLayout>

            {post.isSuccess && post.data?.id && <UnsplashGallery
                isOpenUnsplashModal={isOpenUnsplashModal}
                setIsOpenUnsplashModal={setIsOpenUnsplashModal}
                postId={post.data?.id}
                slug={post.data.slug}
            />}

            {post.data?.id && <CommentSidebar
                showCommentSidebar={showCommentSidebar}
                setShowCommentSidebar={setShowCommentSidebar}
                postId={post.data?.id}
            />}

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
                        {
                            post.isSuccess && post.data && post.data?.featuredImage &&
                            <Image src={post.data?.featuredImage} alt={post.data?.title} fill className='rounded-xl' />
                        }

                        {data?.user.id === post.data?.authorId && <div onClick={() => setIsOpenUnsplashModal(true)}
                            className='absolute top-2 left-2 bg-black/30 z-10 cursor-pointer text-white p-2 rounded-xl hover:bg-black'>
                            <BiImageAdd className='text-2xl' />
                        </div>}
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
                    <div className="prose lg:prose-xl">
                        <Interweave
                            content={post.data?.html}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default PostPage