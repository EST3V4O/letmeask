import { ButtonHTMLAttributes } from 'react'
import ex from 'classnames'

import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  forCancel?: boolean;
  forDelete?: boolean;
  isSwitcher?: boolean;
}

export function Button({
  isOutlined = false,
  forCancel = false,
  forDelete = false,
  isSwitcher = false,
  ...props
}: ButtonProps) {

  return (
    <button 
      className={ex(
        'button',
        { outlined: isOutlined },
        { cancel: forCancel },
        { delete: forDelete },
        { switcher: isSwitcher },
        )}
      {...props}
    />
  )
}