import { type ReactNode, type FC  } from 'react'
import Header from '~/components/Header';

interface Props {
    children: ReactNode;
}

const MainLayout: FC<Props> = ({ children }) => {
    return (
        <div className='flex flex-col w-full h-full'>
            <Header />
            {children}
        </div>
    )
}

export default MainLayout