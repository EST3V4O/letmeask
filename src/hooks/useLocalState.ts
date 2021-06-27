import { useEffect, useState } from "react";

export function useLocalState(key: string, initialValue = '') {
  const [state, setState] = useState(() => {
    const storageData = localStorage.getItem('theme')

    if(storageData) {
      return JSON.parse(storageData)
    }

    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state, key, initialValue])

  return [state, setState]
}