import { FC, useState } from 'react'

interface CryptoPairTableProps {
  data: ProviderData[]
}

const CryptoPairsTable: FC<CryptoPairTableProps> = (props) => {
  const { data } = props
  const [ascSortOrder, setAscSortOrder] = useState(true)

  return (
    <table className='w-full'>
      <thead>
        <tr>
          <th className='text-left'>
            <span>
              Provider
            </span>
          </th>
          <th className='text-right'>
            <span className='cursor-pointer' onClick={() => setAscSortOrder(prev => !prev)}>
              { ascSortOrder ? '↓' : '↑' } Price
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {
          data
            .sort((a, b) => {
              if (ascSortOrder) {
                return Number(a.newPrice) - Number(b.newPrice)
              }

              return Number(b.newPrice) - Number(a.newPrice)
            })
            .map((provider: ProviderData, index) => (
              <tr key={index} className='border-b-2 border-gray-300 last-of-type:border-0'>
                <td className='w-1/4 capitalize'>
                  {provider.provider}
                </td>
                <td className='w-1/4 text-right'>
                  {
                    provider.newPrice === '0' ?
                      <span className='text-yellow-500'>
                        N/A
                      </span> :
                      <span className={provider.newPrice >= provider.oldPrice ? 'text-green-500' : 'text-red-500'}>
                        {provider.newPrice !== '0' ? provider.newPrice : 'N/A'}
                      </span>
                  }
                </td>
              </tr>
            ))
        }
      </tbody>
    </table>
  )
}

export default CryptoPairsTable
