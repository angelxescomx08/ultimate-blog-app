import React from 'react'

const SideSection = () => {
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
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='flex space-x-6 items-center group'>
                                <div className='h-full w-2/5 bg-gray-300 rounded-xl aspect-square'></div>
                                <div className='w-3/5 flex flex-col space-y-2'>
                                    <div className='text-lg font-semibold group-hover:underline decoration-indigo-600'>Lorem ipsum dolor sit amet consectetur.</div>
                                    <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nesciunt tempora nisi a nulla ipsam amet deserunt recusandae.</div>
                                    <div className='flex space-x-1 items-center w-full'>
                                        <div className='w-8 h-8 bg-gray-300 rounded-full'></div>
                                        <div>Ángel Hernández &#x2022; </div>
                                        <div>Dec 22, 2022</div>
                                    </div>
                                </div>

                            </div>
                        ))
                    }
                </div>
            </div>
        </aside>
    )
}

export default SideSection