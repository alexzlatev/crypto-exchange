import { createContext, useEffect, useState } from 'react'

export interface AppContextData {
  contextReady: boolean
  allAvailablePairs: CryptoPairs[]
}

export const AppContext = createContext<Partial<AppContextData>>({
  contextReady: false,
  allAvailablePairs: []
})

const AppProvider = ({ children }: any) => {
  const [contextReady, setContextReady] = useState(false)
  const [allAvailablePairs, setAllAvailablePairs] = useState<CryptoPairs[]>([])

  // Fetch all supported crypto pairs from different APIs and map them to common structure, used in our app
  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all([
          fetch(`${process.env.REACT_APP_BINANCE_API}/api/v3/exchangeInfo`),
          fetch(`${process.env.REACT_APP_HUOBI_API}/v1/common/symbols`)
        ])
        const [binanceData, huobiData] = await Promise.all(results.map(res => res.json()))
        const cryptoPairs: string[] = []

        binanceData.symbols.forEach((pairs: any) => {
          cryptoPairs.push(JSON.stringify({
            symbol: pairs.symbol.toLowerCase(),
            baseAsset: pairs.baseAsset.toLowerCase(),
            quoteAsset: pairs.quoteAsset.toLowerCase()
          }))
        })
        huobiData.data.forEach((pairs: any) => {
          cryptoPairs.push(JSON.stringify({
            symbol: pairs.symbol,
            baseAsset: pairs['base-currency'],
            quoteAsset: pairs['quote-currency']
          }))
        })

        const setOfCryptoPairs = new Set(cryptoPairs)
        const uniqueCryptoPairs = Array.from(setOfCryptoPairs).map(pairs => JSON.parse(pairs))

        setAllAvailablePairs(uniqueCryptoPairs)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  useEffect(() => {
    if (allAvailablePairs.length > 0) {
      setContextReady(true)
    }
  }, [allAvailablePairs])

  return (
    <AppContext.Provider value={{
      contextReady,
      allAvailablePairs
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
