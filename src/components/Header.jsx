import React, { useState, useEffect } from 'react';

const Header = ({ isPatient, isDoctor, handlePatientLogin, handleDoctorLogin, handleClick2, handleContactUsClick, setShowAddDoctorPopup }) => {

  return (
    <header className="nav_bar bg-transparent rounded-lg body-font w-full fixed top-0 left-0 z-[10] -translate-y-20">
      <div className="flex mx-auto m-3 pl-5 pr-5 flex-wrap flex-col md:flex-row items-center">
        <span className="text-xl">
          <h1 className="text-5xl text-blue-100 header_heading">Appointments</h1>
        </span>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {!isPatient && !isDoctor && (
            <div className="flex">
              <button className="nav_button border rounded-lg m-2 px-4 py-2 text-2xl bg-transparent font-medium cursor-pointer" onClick={handlePatientLogin}>
                Patient
              </button>
              <button className="nav_button border rounded-lg m-2 px-4 py-2 text-2xl bg-transparent font-medium cursor-pointer" onClick={handleDoctorLogin}>
                Doctor
              </button>
            </div>
          )}
          {isDoctor && (
            <button className="nav_button border rounded-lg m-2 px-4 py-2 text-2xl bg-transparent font-medium cursor-pointer" onClick={() => setShowAddDoctorPopup(true)}>
              Add Doctor
            </button>
          )}
          {isDoctor && (
            <button className="nav_button border rounded-lg m-2 px-4 py-2 text-2xl bg-transparent font-medium cursor-pointer" onClick={handlePatientLogin}>
              Patient
            </button>
          )}
          <button className="nav_button glow-on-hover border rounded-lg m-2 px-4 py-2 text-2xl bg-transparent font-medium cursor-pointer" onClick={handleContactUsClick}>
            Contact Us
          </button>
          <button className="nav_button border rounded-lg m-2 px-4 py-2 text-2xl bg-transparent font-medium cursor-pointer" onClick={handleClick2}>
            Doctors
          </button>
          {isPatient && (
            <button className="nav_button border rounded-lg m-2 px-4 py-2 text-2xl bg-transparent font-medium cursor-pointer" onClick={handleDoctorLogin}>
              Doctor
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
