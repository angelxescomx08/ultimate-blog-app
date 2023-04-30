import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { api } from '~/utils/api'

const SideSection = () => {

    const readingList = api.post.getReadingList.useQuery();

    return (
        <aside className='col-span-4 w-full p-6 flex flex-col space-y-4'>
            <div>
                <h3 className='my-6 font-semibold text-lg'>People you might be interested</h3>
                <div className='flex flex-col space-4-4'>
                    {
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='flex flex-row space-x-5 items-center'>
                                <div className='bg-gray-300 w-10 h-10 rounded-full flex-none'></div>
                                <div>
                                    <div className='text-gray-900 font-bold text-sm'>John Doe</div>
                                    <div className='text-xs'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, unde.</div>
                                </div>
                                <div>
                                    <button className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>
                                        Follow
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                <h3 className='my-6 font-semibold text-lg'>Your reading list</h3>
                <div className='flex flex-col space-y-8'>
                    {
                        readingList.data && readingList.data.map((bookmark) => (
                            <Link href={`${bookmark.post.slug}`} key={bookmark.id} className='flex space-x-6 items-center group'>
                                <div className='h-full w-2/5 bg-gray-300 rounded-xl aspect-square'>

                                </div>
                                <div className='w-3/5 flex flex-col space-y-2'>
                                    <div className='text-lg font-semibold group-hover:underline decoration-indigo-600'>
                                        {bookmark.post.title}
                                    </div>
                                    <div className='truncate'>
                                        {bookmark.post.description}
                                    </div>
                                    <div className='flex space-x-1 items-center w-full'>
                                        <div className='relative w-8 h-8 bg-gray-300 rounded-full'>
                                            <Image className='rounded-full' src={bookmark.post.author.image ?? ''} fill alt="" />
                                        </div>
                                        <div>{bookmark.post.author.name} &#x2022; </div>
                                        <div>{dayjs(bookmark.post.createdAt).format('DD/MM/YYYY')}</div>
                                    </div>
                                </div>

                            </Link>
                        ))
                    }
                </div>
            </div>
        </aside>
    )
}

export default SideSection