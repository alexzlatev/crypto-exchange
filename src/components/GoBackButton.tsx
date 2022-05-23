import { FC } from 'react'
import { Link } from 'react-router-dom'

interface GoBackButtonProps {
  absolutePath?: string
}

const GoBackButton: FC<GoBackButtonProps> = (props) => {
  const { absolutePath } = props

  return (
    <Link to={absolutePath ? absolutePath : -1 as any}
          className='absolute top-8 left-8 p-2 rounded-lg shadow-wrapper'>
      Go Back
    </Link>
  )
}

export default GoBackButton
