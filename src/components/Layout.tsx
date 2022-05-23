import { FC } from 'react'
import { Outlet } from 'react-router'

const Layout: FC = () => {
  return (
    <div className='flex w-screen h-screen justify-center items-center bg-mainBackground'>
      <Outlet />
    </div>
  )
}

export default Layout
