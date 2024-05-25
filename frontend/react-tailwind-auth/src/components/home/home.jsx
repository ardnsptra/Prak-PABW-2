import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
function Home() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
        const token = Cookies.get('token');
        const response = await fetch('http://localhost:3030/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      
        const data = await response.json();
        setProfile(data);
      };
    getProfile();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen ">
        <div className="max-w-sm mx-auto rounded-lg border border-gray-200 shadow-md dark:bg-white-800 dark:border-gray-700 p-4">
        {profile && (
            <>
            <img className="w-32 h-32 rounded-full mx-auto" src={`http://localhost:3000/${profile.profileImage}`} alt="Profile" />
            <div className="text-center mt-2">
                <h2 className="text-lg font-semibold">{profile.fullName}</h2>
                <p className="text-gray-600 font-semibold shadow-whiteOutline">Username: {profile.username}</p>
                <p className="text-gray-600 font-semibold shadow-whiteOutline">Email: {profile.email}</p>
                <p className="text-gray-600 font-semibold shadow-whiteOutline">Tanggal Lahir: {profile.dateOfBirth}</p>
            </div>
            </>
        )} 
        </div>  
    </div>
  );
}

export default Home;
