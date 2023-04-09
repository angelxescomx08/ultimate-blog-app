import { IoReorderThreeOutline } from 'react-icons/io5'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'

const HomePage = () => {
  return (
    <div className='flex flex-col w-full h-screen'>
      <header className='h-20 w-full flex flex-row justify-around items-center bg-white border-b-[1px] border-gray-300'>
        <div>
          <IoReorderThreeOutline className='text-2xl text-gray-600' />
        </div>
        <div className='font-thin text-xl'>Ultimate Blog App</div>
        <div className='flex items-center space-x-2'>
          <div>
            <BsBell className='text-2xl text-gray-600' />
          </div>
          <div>
            <div className='w-5 h-5 bg-gray-600 rounded-full'></div>
          </div>
          <div>
            <button className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'>
              <div>Write</div>
              <div>
                <FiEdit />
              </div>
            </button>
          </div>
        </div>
      </header>
      <section className='grid grid-cols-12 place-items-center w-full h-full'>
        <main className='col-span-8 border-r border-gray-300 w-full h-full px-24'>
          <div className='flex flex-col space-y-4 w-full py-10'>
            <div className='flex space-x-4 items-center w-full'>
              <label htmlFor='search' className='relative w-full border-gray-800 border rounded-3xl'>
                <div className='absolute left-2 h-full flex items-center'>
                  <CiSearch />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className='w-full rounded-3xl outline-none placeholder:text-gray-300 placeholder:text-xs text-sm py-1 px-4 pl-7'
                  placeholder='Search...'
                />
              </label>
              <div className='flex items-center w-full space-x-4 justify-end'>
                <div>
                  My topics:
                </div>
                <div className='flex space-x-2 items-center'>
                  {
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className='rounded-3xl bg-gray-200/50 px-4 py-3'>tag {i}</div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className='pb-8 w-full justify-between flex items-center border-b border-gray-300'>
              <div>Articles</div>
              <div>
                <button className='flex items-center font-semibold space-x-2 rounded-3xl px-4 py-1.5 border-gray-800 border'>
                  <div>Following</div>
                  <div>
                    <HiChevronDown className='text-xl' />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col justify-center space-y-8'>
            {
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex group flex-col space-y-4 pb-8 border-b border-gray-300 last:border-none'>
                  <div>
                    <div className='flex w-full items-center space-x-2'>
                      <div className='w-10 h-10 bg-gray-400 rounded-full'></div>
                      <div>
                        <p className='font-semibold'>Angel Hernández &#x2022; 23 April. 2022 </p>
                        <p className='text-sm'>Founder, teacher & developer</p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-12 w-full gap-4'>
                    <div className='col-span-8 flex-col space-y-4'>
                      <p className='text-2xl font-bold text-gray-800 group-hover:underline decoration-indigo-600'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab, blanditiis.
                      </p>
                      <p className='text-sm text-gray-500 break-words'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Tenetur quibusdam quos numquam, omnis deleniti perferendis
                        aperiam doloribus, quo ipsa dolorum at unde alias? Obcaecati
                        rem commodi distinctio, expedita dignissimos maxime hic
                        similique natus odio, ipsum atque exercitationem? Quos
                        perspiciatis dignissimos optio reprehenderit perferendis.
                        Harum, quod expedita, reiciendis voluptates, numquam nam
                        quae distinctio dolorem mollitia corporis doloremque dicta
                        consequatur accusantium pariatur.
                      </p>
                    </div>
                    <div className='col-span-4'>
                      <div className='bg-gray-300 w-full h-full rounded-xl transition hover:scale-105 transform duration-300 hover:shadow-xl'></div>
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center w-full space-x-4 justify-start py-4'>
                      <div>
                        My topics:
                      </div>
                      <div className='flex space-x-2 items-center'>
                        {
                          Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='rounded-3xl bg-gray-200/50 px-5 py-2'>
                              tag {i}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </main>
        <aside className='col-span-4 w-full h-full'>
          aside
        </aside>
      </section>
    </div>
  )
}

export default HomePage