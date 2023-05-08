import { useContext, useState } from 'react'
import Modal from '../Modal'
import { GlobalContext } from '~/context/GlobalContext'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { api } from '~/utils/api';
import { toast } from 'react-hot-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import TagsAutocompletion from '../TagsAutocompletion';
import TagForm from '../TagForm';

type WriteFormType = {
    title: string;
    description: string;
    text: string;
}

export const writeFormSchema = z.object({
    title: z.string().min(20),
    description: z.string().min(60),
    text: z.string().min(100)
})

const WriteFormModal = () => {
    const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext)

    const [isTagCreateModalOpen, setIsTagCreateModalOpen] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const { register, handleSubmit, formState: { errors }, reset } = useForm<WriteFormType>({
        resolver: zodResolver(writeFormSchema)
    })

    const postRouter = api.useContext().post

    const createPost = api.post.createPost.useMutation({
        onSuccess: async (data, variables, context) => {
            toast.success('Post created successfully');
            setIsWriteModalOpen(false);
            reset();
            await postRouter.getPost.invalidate()
            console.log({ data, variables, context });
        },
        onError: (error, variables, context) => {
            console.log({ error, variables, context });
        }
    })

    const onSubmit = (data: WriteFormType) => createPost.mutate(data);

    return (

        <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
            <TagForm
                isOpen={isTagCreateModalOpen} 
                onClose={() => setIsWriteModalOpen(false)}
            />

            <div className='flex w-full space-x-4 items-center my-4'>
                <div className='z-10 w-4/5'>
                    <TagsAutocompletion />
                </div>
                <button
                    onClick={() => { setIsTagCreateModalOpen(true) }}
                    className='transition text-sm whitespace-nowrap hover:border-gray-900 hover:text-gray-900 rounded space-x-2 px-4 py-2.5 border border-gray-200'>
                    Create Tag
                </button>
            </div>
            <form
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
                className='flex relative flex-col justify-center items-center'
            >
                {
                    createPost.isLoading &&
                    <div className='absolute w-full h-full flex items-center justify-center'>
                        <AiOutlineLoading3Quarters className='animate-spin' />
                    </div>
                }

                <input
                    type="text"
                    id="title"
                    placeholder='Title of the blog'
                    className='w-full h-full border border-gray-300 focus:border-gray-600 outline-none p-4 rounded-xl'
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    {...register('title')}
                />
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access*/}
                <p className='text-sm text-red-500 text-left w-full pb-2'>{errors.title?.message}</p>
                <input
                    type="text"
                    id="shortDescription"
                    placeholder='Short description'
                    className='w-full h-full border border-gray-300 focus:border-gray-600 outline-none p-4 rounded-xl'
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    {...register('description')}
                />
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access*/}
                <p className='text-sm text-red-500 text-left w-full pb-2'>{errors.description?.message}</p>
                <textarea
                    id="mainText"
                    cols={10}
                    rows={10}
                    placeholder='Blog main text...'
                    className='w-full h-full border border-gray-300 focus:border-gray-600 outline-none p-4 rounded-xl'
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    {...register('text')}
                />
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access*/}
                <p className='text-sm text-red-500 text-left w-full pb-2'>{errors.text?.message}</p>
                <button type='submit' onClick={() => { setIsWriteModalOpen(true) }} className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>
                    Publish
                </button>
            </form>
        </Modal>

    )
}

export default WriteFormModal