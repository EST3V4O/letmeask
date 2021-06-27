import { useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'

import moon from '../../assets/images/moon.svg'
import sun from '../../assets/images/sun.svg'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button onClick={toggleTheme} isSwitcher>
      { theme === 'light' ? (
        <img src={moon} alt="" />
      ) : (
        <img src={sun} alt="Sol" />
      )}
    </Button>
  )
}