declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_BINANCE_API: string
      REACT_APP_BINANCE_WS: string
      REACT_APP_HUOBI_API: string
    }
  }
}

export {};
