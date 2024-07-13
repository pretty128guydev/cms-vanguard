import React from 'react';
const SuccessCard = () => {
  return (
    <div className="bg-green-100 border border-green-400 -z-10 text-green-700 px-4 py-3 rounded relative" role="alert">
      <p className="font-bold text-2xl">Success!</p>
      <p className="block sm:inline mt-4">You have successfully submitted the details of the claim. To submit details on another claim, please restart the form using the restart button in the upper right hand corner.</p>
    </div>
  );
};

export default SuccessCard;
