import React from 'react';

const FieldDoctors = ({ field, doctors, addAppointment }) => {
  return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-semibold mt-4">{field}</h2>
          <div className="flex">
            {doctors.map((doctor, index) => (
              <div className="doctor-container text-xl" key={index}>
                <p>{doctor.name}</p>
                <p className="doct_field">Field: {doctor.field}</p>
                <button className = "bookit" onClick={() => addAppointment(doctor)}>Book Appointment</button>
              </div>
            ))}
          </div>

        </div>
      </div>
  );
};

export default FieldDoctors;
