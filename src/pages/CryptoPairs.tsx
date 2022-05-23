import { useCallback, useEffect, useState, useContext, FC } from 'react'
import { useNavigate, useParams } from 'react-router'
// import { gunzip, strFromU8 } from 'fflate'

import { AppContext, AppContextData } from '../contexts/AppContext'
import CryptoPairsTable from '../components/CryptoPairsTable'
import GoBackButton from '../components/GoBackButton'

enum Providers {
  BINANCE = 'binance',
  HUOBI = 'huobi'
}

const initialProvidersData = [
  { provider: Providers.BINANCE, oldPrice: '0', newPrice: '0' },
  { provider: Providers.HUOBI, oldPrice: '0', newPrice: '0' }
]

const CryptoPairs: FC = () => {
  const { pairs } = useParams()
  const { contextReady, allAvailablePairs } = useContext(AppContext) as AppContextData
  const [initCheck, setInitCheck] = useState(false)
  const [cryptoPairs, setCryptoPairs] = useState<CryptoPairs | null>(null)
  const [cryptoData, setCryptoData] = useState<ProviderData[]>(initialProvidersData)
  const [updateBinance, setUpdateBinance] = useState(false)
  const [updateHuobi, setUpdateHuobi] = useState(false)
  const navigate = useNavigate()

  const updateCryptoData = useCallback((provider: Providers, newPrice: string) => {
    setCryptoData((oldCryptoData) => {
      const searchedProvider = oldCryptoData.findIndex((search) => search.provider === provider)
      const newCryptoData = Array.from(oldCryptoData)

      newCryptoData[searchedProvider].oldPrice = newCryptoData[searchedProvider].newPrice
      newCryptoData[searchedProvider].newPrice = newPrice

      return newCryptoData
    })
  }, [])

  // Check if the crypto pairs in the url params is supported by our APIs
  useEffect(() => {
    if (!contextReady) return

    const searchedCryptoPairs = allAvailablePairs.find((search) => search.symbol === pairs?.toLowerCase())

    if (!searchedCryptoPairs) {
      navigate('/404')
    } else {
      setCryptoPairs(searchedCryptoPairs)
      setInitCheck(true)
    }
  }, [contextReady, allAvailablePairs, navigate, pairs])

  // Make polling to track price changes for Huobi api, because their WebSocket is not working
  useEffect(() => {
    if (!initCheck || !updateHuobi) return

    const huobiPriceRefresher = setInterval(async () => {
      const result = await fetch(`${process.env.REACT_APP_HUOBI_API}/market/detail/merged?symbol=${pairs}`)
      const huobiData = await result.json()

      updateCryptoData(Providers.HUOBI, huobiData.tick.close.toFixed(8))
    }, 1000 * 10)

    return () => {
      clearInterval(huobiPriceRefresher)
    }
  }, [initCheck, updateHuobi, pairs])

  // Open Binance WebSocket to track price changes for given crypto pairs
  useEffect(() => {
    if (!initCheck || !updateBinance) return

    const socket = new WebSocket(`${process.env.REACT_APP_BINANCE_WS}/${pairs}@miniTicker`)

    socket.onmessage = (event) => {
      const result = JSON.parse(event.data)
      updateCryptoData(Providers.BINANCE, result.c)
    }

    return () => {
      socket.close()
    }
  }, [initCheck, updateBinance, pairs])

  // Initial price load, to ensure we see price on page load, before the first message from WS arrives
  useEffect(() => {
    (async () => {
      if (!initCheck) return

      try {
        const results = await Promise.all([
          fetch(`${process.env.REACT_APP_BINANCE_API}/api/v3/avgPrice?symbol=${pairs?.toUpperCase()}`),
          fetch(`${process.env.REACT_APP_HUOBI_API}/market/detail?symbol=${pairs}`)
        ])
        const [binanceData, huobiData] = await Promise.all(results.map(res => res.json()))

        if (binanceData.price) {
          updateCryptoData(Providers.BINANCE, binanceData.price)
          setUpdateBinance(true)
        }
        if (huobiData.status !== 'error') {
          updateCryptoData(Providers.HUOBI, huobiData.tick.close.toFixed(8))
          setUpdateHuobi(true)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [initCheck, pairs])

  // THE HUOBI WEBSOCKET IS NOT WORKING, BUT THIS SHOULD BE THE WAY TO USE IT
  //
  // useEffect(() => {
  //   const huobiSocket = new WebSocket('wss://api.huobi.pro/ws') // NOT WORKING
  //   const huobiSocket = new WebSocket('wss://www.hbdm.com/ws') // WORKING BUT WRONG
  //
  //   huobiSocket.onopen = () => {
  //     huobiSocket.send(JSON.stringify({
  //       sub: `market.${pairs}.ticker`,
  //       id: 'id1'
  //     }))
  //   }
  //
  //   huobiSocket.onmessage = (event) => {
  //     const fr = new FileReader()
  //     fr.onload = () => {
  //       // @ts-ignore
  //       gunzip(new Uint8Array(fr.result), (error, raw) => {
  //         if (error) {
  //           console.error(error)
  //           return
  //         }
  //
  //         const data = JSON.parse(strFromU8(raw))
  //         if (data.ping) {
  //           huobiSocket.send(JSON.stringify({
  //             pong: data.ping
  //           }))
  //         }
  //         console.log(data)
  //       })
  //     }
  //     fr.readAsArrayBuffer(event.data)
  //   }
  //
  //   return () => {
  //     huobiSocket.close()
  //   }
  // }, [])

  return (
    <div className='min-w-[50%] p-6 rounded-xl shadow-wrapper'>
      <GoBackButton absolutePath='/' />
      <h1 className='text-xl font-bold mb-4'>
        Crypto Pairs: {cryptoPairs?.baseAsset.toUpperCase()} / {cryptoPairs?.quoteAsset.toUpperCase()}
      </h1>
      <CryptoPairsTable data={cryptoData} />
    </div>
  )
}

export default CryptoPairs
