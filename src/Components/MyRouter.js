import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import UserForm from './UserForm';
import Guidelines from './Guidelines';
import UserDetailsContext from './UserDetailsContext';

export default function MyRouter() {

    return (
        <div>
            <nav className='navbar navbar-dark bg-dark mx-auto '>
                <ul className="container-fluid">
                    <li className="nav-item"><Link to='/Guidelines' className='nav-link text-white bg-dark'>הוראות</Link></li>
                    <li className="nav-item"><Link to='/UserForm' className='nav-link text-white bg-dark' >מילוי הטופס</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path='/' element={<UserDetailsContext><UserForm /></UserDetailsContext>}></Route>
                <Route path='/Guidelines' element={<UserDetailsContext><Guidelines /></UserDetailsContext>}></Route>
                <Route path='/UserForm' element={<UserDetailsContext><UserForm /></UserDetailsContext>}></Route>
            </Routes>
        </div>
    )
}