import { useRouter } from 'next/router'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MainLayout } from '~/layouts'
import { api } from '~/utils/api'

const PostPage = () => {
    const router = useRouter()

    const post = api.post.getPost.useQuery({ slug: router.query.slug as string }, {
        //solo hacer la consulta cuando slug esta definido
        enabled: !!router.query.slug
    })

    return (
        <MainLayout>
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