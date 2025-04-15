import React from 'react';
 

const Loading = () => {
  return (
    <div className="spinner flex flex-col flex-1 justify-center items-center">
      <i className = 'fa-solid fa-spinner animate-spin text-4xl sm:text-5xl'></i>Loading...
    </div>
  );
};

export default Loading;