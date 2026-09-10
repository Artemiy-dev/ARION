import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, ...props }: ButtonProps) {
  return <button className={cn('button', className)} {...props} />
}
