'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  minDate?: string;
  maxDate?: string;
}

export default function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Выберите дату",
  label,
  minDate,
  maxDate 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatInputValue = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    
    // Преобразуем: 0 (воскресенье) -> 6, 1 (понедельник) -> 0, 2 (вторник) -> 1, и т.д.
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const days = [];
    
    // Добавляем пустые дни в начале месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const handleDateSelect = (date: Date) => {
    if (isDisabled(date)) return;
    
    setSelectedDate(date);
    onChange(formatInputValue(date));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    onChange('');
  };

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Генерируем 20 лет назад и 10 лет вперед
    for (let year = currentYear - 2; year <= currentYear + 20; year++) {
      years.push(year);
    }
    return years;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={selectedDate ? formatDate(selectedDate) : ''}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {selectedDate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearDate();
              }}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Календарь */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-[#1D1D1D] border border-gray-600 rounded-lg shadow-xl p-4 min-w-[320px]">
          {/* Заголовок календаря */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">
                {monthNames[currentMonth.getMonth()]}
              </h3>
              
              {/* Выбор года */}
              <div className="relative">
                <button
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="flex items-center gap-1 px-3 py-1 text-white font-semibold hover:bg-gray-700 rounded transition-colors border border-gray-600"
                >
                  {currentMonth.getFullYear()}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showYearPicker ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Выпадающий список годов */}
                {showYearPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-[120px] z-10">
                    {getYearRange().map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`
                          w-full px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors
                          ${year === currentMonth.getFullYear()
                            ? 'bg-blue-600 text-white'
                            : year === new Date().getFullYear()
                            ? 'bg-gray-600 text-white'
                            : 'text-gray-300'
                          }
                        `}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="text-center text-xs text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Дни месяца */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="text-center">
                {day ? (
                  <button
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled(day)}
                    className={`
                      w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
                      ${isSelected(day) 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : isToday(day)
                        ? 'bg-gray-600 text-white'
                        : isDisabled(day)
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>

          {/* Быстрые действия */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const today = new Date();
                  if (!isDisabled(today)) {
                    handleDateSelect(today);
                  }
                }}
                className="flex-1 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Сегодня
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 