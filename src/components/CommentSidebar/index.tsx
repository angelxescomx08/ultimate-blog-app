import { type Dispatch, type SetStateAction, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiXMark } from 'react-icons/hi2'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '~/utils/api';
import { toast } from 'react-hot-toast';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

type CommentSideProps = {
    showCommentSidebar: boolean;
    setShowCommentSidebar: Dispatch<SetStateAction<boolean>>;
    postId: string;
}

type CommentFormType = { text: string }

export const CommentPostSchema = z.object({
    text: z.string().min(3),
})

const CommentSidebar = ({ showCommentSidebar, setShowCommentSidebar, postId }: CommentSideProps) => {

    const postRoute = api.useContext().post;

    const submmitComment = api.post.submitComment.useMutation({
        onSuccess: async () => {
            toast.success('Comment posted')
            await postRoute.getComments.invalidate({
                postId
            })
            reset()
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const { register, handleSubmit, formState: { isValid }, reset } = useForm<CommentFormType>({
        resolver: zodResolver(CommentPostSchema)
    })

    const getComments = api.post.getComments.useQuery({
        postId
    })


    return (
        <Transition.Root show={showCommentSidebar} as={Fragment}>
            <Dialog as="div" onClose={() => setShowCommentSidebar(false)}>
                <div className='fixed right-0 top-0'>
                    <Transition.Child
                        enter='transition duration-700'
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

                                <form
                                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                    onSubmit={
                                        handleSubmit((data) => {
                                            submmitComment.mutate({
                                                text: data.text,
                                                postId
                                            })
                                        })
                                    }
                                    className='w-full flex flex-col items-end space-y-4 my-6'>
                                    <textarea
                                        id="comment"
                                        rows={3}
                                        placeholder='Blog main text...'
                                        className='shadow-lg m-1 w-full outline-none p-4 rounded-xl'
                                        {...register('text')}
                                    />

                                    {
                                        isValid &&
                                        <button
                                            type='submit'
                                            className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>
                                            Comment
                                        </button>
                                    }
                                </form>
                                <div className='flex flex-col space-y-4 justify-center items-center'>
                                    {
                                        getComments.isSuccess && getComments.data.map((comment, i) => (
                                            <div className='flex w-full flex-col space-y-2 border-b last:border-none border-gray-300 pb-4' key={i}>
                                                <div className='flex w-full items-center space-x-2'>
                                                    <div className='w-10 h-10 bg-gray-400 rounded-full relative'>

                                                    </div>
                                                    <div>
                                                        <p className='font-semibold'>
                                                            {comment.author.name}
                                                        </p>
                                                        <p className=''>
                                                            {dayjs(comment.createdAt).fromNow()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='text-sx text-gray-600'>
                                                    {comment.text}
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
    )
}

export default CommentSidebar