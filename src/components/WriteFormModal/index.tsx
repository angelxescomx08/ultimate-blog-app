import { useContext } from 'react'
import Modal from '../Modal'
import { GlobalContext } from '~/context/GlobalContext'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { api } from '~/utils/api';

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const { register, handleSubmit, formState: { errors } } = useForm<WriteFormType>({
        resolver: zodResolver(writeFormSchema)
    })

    const createPost = api.post.createPost.useMutation({
        onSuccess: (data, variables, context) => {
            console.log('Se ha creado correctamente');
            console.log({ data, variables, context });
        },
        onError: (error, variables, context) => {
            console.log({ error, variables, context });
        }
    })

    const onSubmit = (data: WriteFormType) => createPost.mutate(data);

    return (
        <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
            <form
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col justify-center items-center'
            >
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