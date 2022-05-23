import GoBackButton from '../components/GoBackButton'
import { FC } from 'react'

const NotFound: FC = () => {
  return (
    <div>
      <GoBackButton absolutePath='/' />
      <h1>Not Found</h1>
    </div>
  )
}

export default NotFound
