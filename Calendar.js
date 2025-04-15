'use client'
import { baseRating, gradients } from '/utils/index';
import React, { useState } from 'react';

const months = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sept',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec'
};

const dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Calendar({ demo, completeData, handleSetMood }) {
  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(Object.keys(months)[curMonth]);
  const [selectedYear, setSelectedYear] = useState(curYear);

  const numericMonth = Object.keys(months).indexOf(selectedMonth);
  const data = completeData?.[selectedYear]?.[numericMonth] || {};

  const firstDayOfMonth = new Date(selectedYear, numericMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate();
  const daysToDisplay = firstDayOfMonth + daysInMonth;
  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 > 0 ? 1 : 0);

  function handleIncrementMonth(val) {
    let newMonthIndex = numericMonth + val;
    let newYear = selectedYear;

    if (newMonthIndex > 11) {
      newMonthIndex = 0;
      newYear++;
    } else if (newMonthIndex < 0) {
      newMonthIndex = 11;
      newYear--;
    }

    setSelectedMonth(Object.keys(months)[newMonthIndex]);
    setSelectedYear(newYear);
  }

  return (
    <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
      {/* Month Navigation */}
      <div className='flex justify-between items-center mb-4'>
        <button onClick={() => handleIncrementMonth(-1)} className='text-indigo-600 font-semibold'>&lt; Prev</button>
        <h2 className='font-bold text-lg text-indigo-700'>{months[selectedMonth]} {selectedYear}</h2>
        <button onClick={() => handleIncrementMonth(1)} className='text-indigo-600 font-semibold'>Next &gt;</button>
      </div>

      {[...Array(numRows).keys()].map((rowIndex) => (
        <div key={rowIndex} className='grid grid-cols-7 gap-1'>
          {dayList.map((_, dayOfWeekIndex) => {
            let dayIndex = (rowIndex * 7) + dayOfWeekIndex - firstDayOfMonth + 1;
            let dayDisplay = dayIndex > 0 && dayIndex <= daysInMonth;

            let isToday =
              dayIndex === now.getDate() &&
              numericMonth === now.getMonth() &&
              selectedYear === now.getFullYear();

            if (!dayDisplay) {
              return <div key={dayOfWeekIndex} className='bg-white h-10'></div>;
            }

            let color = demo
              ? gradients.indigo[baseRating[dayIndex]]
              : dayIndex in data
              ? gradients.indigo[data[dayIndex]]
              : 'white';

            return (
              <div
                style={{ background: color }}
                key={dayOfWeekIndex}
                onClick={() => handleSetMood && handleSetMood(dayIndex)}
                className={
                  'text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg cursor-pointer ' +
                  (isToday ? ' border-indigo-400' : ' border-indigo-100') +
                  (color === 'white' ? ' text-indigo-400' : ' text-white')
                }
              >
                {dayIndex}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
