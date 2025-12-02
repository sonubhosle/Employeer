import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  avatar?: string;
  subLabel?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string | string[]; // Support single or multi-value (though simplified for now)
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  icon,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
            w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 rounded-xl text-left 
            transition-all duration-300 focus:ring-2 focus:ring-primary/50 outline-none
            ${isOpen ? 'ring-2 ring-primary/50 border-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && <span className="text-gray-400">{icon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-2">
                {selectedOption.avatar && (
                    <img src={selectedOption.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                )}
                {selectedOption.icon && (
                    <span className="text-gray-500">{selectedOption.icon}</span>
                )}
                <div className="flex flex-col leading-none">
                    <span className="text-sm font-medium text-gray-800 dark:text-white truncate">{selectedOption.label}</span>
                    {selectedOption.subLabel && <span className="text-[10px] text-gray-500 mt-0.5">{selectedOption.subLabel}</span>}
                </div>
            </div>
          ) : (
            <span className="text-sm text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <div 
        className={`
          absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
          rounded-xl shadow-xl overflow-hidden origin-top transition-all duration-200 ease-out
          ${isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors group
                ${value === option.value 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                 {option.avatar && (
                    <img src={option.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                 )}
                 {option.icon && <span className={value === option.value ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}>{option.icon}</span>}
                 <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    {option.subLabel && <div className="text-[10px] opacity-70">{option.subLabel}</div>}
                 </div>
              </div>
              {value === option.value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;