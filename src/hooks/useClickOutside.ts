import { useCallback, useEffect } from 'react'

const useClickOutside = (ref: any, handler: any) => {
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      handler()
    }
  }, [handler, ref])

  useEffect(() => {
    document.addEventListener('pointerdown', handleClickOutside)

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [ref, handleClickOutside])
}

export default useClickOutside
