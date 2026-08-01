import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './CustomSelect.module.css';

function CustomSelect({ value, options, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      {/* Dropdown Header/Trigger */}
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`}
        onClick={handleToggle}
      >
        <span className={styles.valueText}>{selectedOption?.label}</span>
        <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} size={16} />
      </button>

      {/* Options List */}
      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
