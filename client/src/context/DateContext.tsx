import React, { createContext, useContext, useState } from 'react';

interface DateContextType {
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  goToYesterday: () => void;
  isToday: boolean;
  formattedDateLabel: string;
}

const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const goToToday = () => setSelectedDate(getTodayString());
  const goToYesterday = () => setSelectedDate(getYesterdayString());

  const isToday = selectedDate === today;

  const formatDateLabel = (dateStr: string): string => {
    if (dateStr === today) return 'Today';
    if (dateStr === getYesterdayString()) return 'Yesterday';

    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        goToToday,
        goToYesterday,
        isToday,
        formattedDateLabel: formatDateLabel(selectedDate),
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) throw new Error('useDate must be used within DateProvider');
  return context;
};
