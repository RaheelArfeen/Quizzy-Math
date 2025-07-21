import React from 'react';
import Header from '../Components/Header';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';

const Root = () => {
    return (
        <div className='min-h-screen flex flex-col justify-between'>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Root;