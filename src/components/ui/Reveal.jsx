import useScrollReveal from '../../hooks/useScrollReveal'

export default function Reveal({ children, className = '', delay = 0, ...props }) {
  const [ref, isVisible] = useScrollReveal()
  const delayClass = delay > 0 ? ` reveal-delay-${delay}` : ''
  return (
    <div
      ref={ref}
      className={`reveal${delayClass}${isVisible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </div>
  )
}
