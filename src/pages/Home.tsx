import { FC, useCallback, useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import { AppContext, AppContextData } from '../contexts/AppContext'
import useClickOutside from '../hooks/useClickOutside'

const Home: FC = () => {
  const { allAvailablePairs } = useContext(AppContext) as AppContextData
  const [search, setSearch] = useState('')
  const filteredPairsRef = useRef(null)
  const navigate = useNavigate()

  useClickOutside(filteredPairsRef, () => setSearch(''))

  const requestSearch = useCallback(() => {
    navigate(`/${search}`)
  }, [navigate, search])

  // Filtering all available crypto pairs to get search suggestions for our search bar
  const listOfFilteredPairs = useCallback(() => {
    if (search.length >= 3) {
      const filteredList = allAvailablePairs
        .filter((pairs) => pairs.symbol.includes(search.replace('/', '').toLowerCase()))
      const shortList = filteredList.slice(0, 10)

      return (
        <ul ref={filteredPairsRef} className='absolute w-full px-2 py-4 mt-6 rounded-lg shadow-wrapper'>
          {
            shortList.length > 0 ? shortList.map((pairs) => (
              <li key={pairs.symbol} className='flex items-center h-[30px] px-2 hover:shadow-input hover:rounded-md hover:bg-mainBackground'>
                <Link to={`/${pairs.symbol}`} className='flex w-full'>
                  {pairs.baseAsset.toUpperCase()} / {pairs.quoteAsset.toUpperCase()}
                </Link>
              </li>
            )) : <li>No such pairs</li>
          }
          {
            filteredList.length > 10 ?
              <li className='text-center'>+{filteredList.length - 10} more</li>
              : null
          }
        </ul>
      )
    }
  }, [allAvailablePairs, search])

  return (
    <div>
      <div className='flex gap-6'>
        <div className='relative'>
          <input value={search}
                 type='text'
                 className='w-[300px] h-[40px] rounded-md shadow-input bg-mainBackground p-4'
                 placeholder='Please enter crypto pairs'
                 onChange={(event) => setSearch(event.target.value)} />
          {listOfFilteredPairs()}
        </div>
        <button type='button'
                className='p-2 rounded-xl shadow-wrapper'
                onClick={requestSearch}>
          Go
        </button>
      </div>
    </div>
  )
}

export default Home
