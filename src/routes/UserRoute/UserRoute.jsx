import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';
import { useQueryClient } from '@tanstack/react-query';

function UserRoute(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isLogin = !!queryClient.getQueryData(["userQuery"]);
    
    useEffect(() => {
        if(!isLogin) {
            navigate("/auth/signin");
        }
    }, []);
    console.log(queryClient.getQueryData(["userQuery"]))
    return (
        <>
          {
            isLogin &&
            <Routes>
                <Route path='/profile' element={<ProfilePage />} />
            </Routes>
          }  
        </>
    );
}

export default UserRoute;