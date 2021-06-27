import { BounceLoader } from 'react-spinners'
import { useTheme } from '../../hooks/useTheme'

import './styles.scss'

export function Spinner({ loading = true }) {
  const { theme } = useTheme()
  
  return (
    <div className={`spinner ${theme}`}>
      <BounceLoader color="#485BFF" loading={loading} />
    </div>
  )
}