import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  forCancel?: boolean;
  forDelete?: boolean
}

export function Button({
  isOutlined = false,
  forCancel = false,
  forDelete = false,
  ...props
}: ButtonProps) {

  const classes = `button ${isOutlined && 'outlined'} ${forCancel && 'cancel'} ${forDelete && 'delete'}`

  return (
    <button 
      className={classes}
      {...props}
    />
  )
}