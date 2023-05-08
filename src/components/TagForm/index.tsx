import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { api } from '~/utils/api';
import Modal from '../Modal';

export const tagCreateSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
})

type TagFormProps = {
    isOpen: boolean,
    onClose: () => void
}

const TagForm = ({ isOpen, onClose }: TagFormProps) => {

    const { register, reset, handleSubmit, formState: { errors } } = useForm<{ name: string, description: string }>({
        resolver: zodResolver(
            tagCreateSchema
        )
    })

    const createTag = api.tag.createTag.useMutation({
        onSuccess: () => {
            toast.success('Tag successfully created')
            reset()
            onClose()
        }
    })

    return (
        <Modal isOpen={isOpen} onClose={() => onClose()} title='Create a tag'>
            <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(data => createTag.mutate(data))}
            >
                <input
                    type="text"
                    id="title"
                    placeholder='Title of the blog'
                    className='w-full h-full border border-gray-300 focus:border-gray-600 outline-none p-4 rounded-xl'
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    {...register('name')}
                />
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access*/}
                <p className='text-sm text-red-500 text-left w-full pb-2'>{errors.name?.message}</p>

                <input
                    type="text"
                    id="title"
                    placeholder='Title of the blog'
                    className='w-full h-full border border-gray-300 focus:border-gray-600 outline-none p-4 rounded-xl'
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    {...register('description')}
                />
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access*/}
                <p className='text-sm text-red-500 text-left w-full pb-2'>{errors.description?.message}</p>

                <div className='flex w-full justify-end'>

                    <button
                        type='submit'
                        className='w-fit transition text-sm whitespace-nowrap hover:border-gray-900 hover:text-gray-900 rounded space-x-2 px-4 py-2.5 border border-gray-200'>
                        Create Tag
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default TagForm