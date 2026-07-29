import styles from './Button.module.css';

/**
 * Button
 * 
 * Reusable premium button component.
 * Supports primary, secondary, link, pill, gradient, and suggested variants.
 *
 * @param {React.ReactNode} children
 * @param {string} [variant='primary']  - 'primary' | 'secondary' | 'link' | 'pill' | 'gradient' | 'suggested'
 * @param {string} [size='md']           - 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} [leftIcon]   - Optional icon to render on the left
 * @param {React.ReactNode} [rightIcon]  - Optional icon to render on the right
 * @param {boolean} [isSelected=false]   - For active pill states
 * @param {string} [className='']        - Additional CSS classes
 * @param {string} [type='button']       - Button type attribute
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon = null,
  rightIcon = null,
  isSelected = false,
  className = '',
  type = 'button',
  ...props
}) {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    isSelected ? styles['button--selected'] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={buttonClasses} {...props}>
      {leftIcon && <span className={styles.button__icon}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={styles.button__icon}>{rightIcon}</span>}
    </button>
  );
}

export function ToggleButton({
  leftLabel = 'Series',
  rightLabel = 'Movies',
  isRightActive = false,
  onChange,
  className = '',
}) {
  const handleToggle = (val) => {
    if (onChange) onChange(val);
  };

  return (
    <div className={`${styles.toggle} ${className}`} onClick={() => handleToggle(!isRightActive)}>
      <div
        className={`${styles.toggle__pill} ${isRightActive ? styles['toggle__pill--right'] : styles['toggle__pill--left']}`}
      />
      <button
        type="button"
        className={`${styles.toggle__btn} ${!isRightActive ? styles['toggle__btn--active'] : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle(false);
        }}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        className={`${styles.toggle__btn} ${isRightActive ? styles['toggle__btn--active'] : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle(true);
        }}
      >
        {rightLabel}
      </button>
    </div>
  );
}

Button.Toggle = ToggleButton;

export default Button;
