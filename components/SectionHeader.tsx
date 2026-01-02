import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  isDropdown?: boolean;
  menuItems?: string[];
  onMenuSelect?: (item: string) => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  icon, 
  actionLabel = "+ ADD DATA", 
  onAction, 
  isDropdown = false, 
  menuItems = ["Add Data"],
  onMenuSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (onAction) {
      onAction();
    } else if (isDropdown) {
      setIsOpen(!isOpen);
    }
  };

  const handleMenuClick = (item: string) => {
    setIsOpen(false);
    if (onMenuSelect) {
      onMenuSelect(item);
    } else if (onAction) {
      onAction();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between mb-3 relative z-20">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm tracking-tight uppercase">
        {icon}
        <span>{title}</span>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={handleClick}
          className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-widest"
        >
          {actionLabel}
          {isDropdown && <ChevronDown size={10} />}
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded shadow-xl z-50 py-1 ring-1 ring-black/5">
              {menuItems.map((item, index) => (
                <button 
                  key={index}
                  className="block w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors uppercase"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};