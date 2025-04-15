'use client'
import { Fugaz_One } from 'next/font/google';
import Calendar from './Calendar';
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from './Loading';
import Login from './Login';
import { motion } from 'framer-motion'; // Import framer-motion

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

const Dashboard = () => {
  const { currentUser, userDataObj, setUserDataObj, loading, logout } = useAuth();  // Add logout here
  const [data, setData] = useState({});
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  // Fix: Memoized version of countValues() to avoid infinite re-renders
  const countValues = useMemo(() => {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          sum_moods += data[year][month][day];
          total_number_of_days++;
        }
      }
    }
    const average_mood = total_number_of_days > 0 ? sum_moods / total_number_of_days : 0;
    return { num_days: total_number_of_days, average_mood };
  }, [data]);

  const statuses = useMemo(() => {
    return {
      ...countValues,
      time_remaining: new Date(midnight - now).toISOString().substr(11, 8), // "HH:MM:SS"
    };
  }, [countValues]);

  useEffect(() => {
    if (!currentUser || !userDataObj) return;
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  async function handleSetMood(mood) {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try {
      const newData = { ...data };

      if (!newData[year]) newData[year] = {};
      if (!newData[year][month]) newData[year][month] = {};
      newData[year][month][day] = mood;

      setData(newData);
      setUserDataObj(newData);

      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: mood,
            },
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.log('Failed to update mood', error.message);
    }
  }

  const moods = {
    Excited: '😁',
    Happy: '😊',
    Sad: '😔',
    Angry: '😖',
    Confused: '😟',
  };

  if (loading) return <Loading />;
  if (!currentUser) return <Login />;

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      <motion.div 
        className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.6 }}
      >
        {Object.keys(statuses).map((status, statusIndex) => (
          <div key={statusIndex} className='flex flex-col gap-1 sm:gap-2'>
            <p className={'font-medium capitalize text-xs sm:text-sm ' + fugaz.className}>
              {status.replaceAll('_', ' ')}
            </p>
            <p className={'text-base sm:text-lg truncate ' + fugaz.className}>
              {statuses[status]}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.h4 
        className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        How do you <span className='textGradient'>feel</span> today?
      </motion.h4>

      <motion.div 
        className='flex items-stretch flex-wrap gap-4'
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {Object.keys(moods).map((mood, moodIndex) => {
          const currentMood = moodIndex + 1;
          return (
            <motion.button
              onClick={() => handleSetMood(currentMood)}
              className={
                'p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 flex-1 ' +
                (moodIndex === 4 ? ' col-span-2 sm:col-span-1 ' : '')
              }
              key={moodIndex}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <p className='text-5xl sm:text-6xl md:text-7xl text-center'>{moods[mood]}</p>
              <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
            </motion.button>
          );
        })}
      </motion.div>

      <button
        onClick={logout} // Logout handler
        className="mt-4 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none"
      >
        Log Out
      </button>

      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  );
};

export default Dashboard;

