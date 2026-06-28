import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type BaseProps = {
  children: ReactNode
  variant?: 'accent' | 'outline' | 'ghost'
  className?: string
}

type AnchorButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type NativeButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

export function Button({ children, variant = 'outline', className = '', ...props }: AnchorButtonProps | NativeButtonProps) {
  const classes = `button button--${variant} ${className}`.trim()

  if ('href' in props && props.href) {
    return (
      <a className={classes} {...props}>
        <span>{children}</span>
        <span className="button__symbol" aria-hidden="true">
          <ArrowRight size={18} strokeWidth={2.4} />
        </span>
      </a>
    )
  }

  const buttonProps = props as NativeButtonProps

  return (
    <button {...buttonProps} className={classes} type={buttonProps.type ?? 'button'}>
      <span>{children}</span>
      <span className="button__symbol" aria-hidden="true">
        <ArrowRight size={18} strokeWidth={2.4} />
      </span>
    </button>
  )
}
