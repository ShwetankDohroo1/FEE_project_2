import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header'
import shwetank from './assets/shwetank.png'
import sidhant from './assets/sidhant.png'
import patel from './assets/patel.png'
import surya from './assets/surya.png'
import doctsign from './assets/doctsign.png'
// import BasicParallax from './components/parallax';
import FieldDoctors from './components/field';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { runAnimation } from "./components/gsap";
gsap.registerPlugin(ScrollTrigger);

// Define default doctors
const defaultDoctors = [
  { id: 1, name: 'Shwetank Dohroo', field: 'Cardiologists' },
  { id: 2, name: 'Sidhant Singh', field: 'ENT Specialist' },
];

const fetchData = async () => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.content;
  }
  catch (error) {
    console.error('There was a problem fetching the data:', error);
    return null;
  }
};

const fields = [
  "Cardiologists",
  "Audiologists",
  "Dentist",
  "ENT Specialist",
  "Gynecologist",
  "Orthopedic Surgeon",
  "Paediatrician",
  "Psychiatrists",
  "Veterinarian",
  "Radiologist",
  "Pulmonologist",
  "Endocrinologist",
  "Oncologist",
  "Neurologist",
  "Cardiothoracic Surgeon"
];
const App = () => {
  //initialize state with default doctors
  const [doctors, setDoctors] = useState(defaultDoctors);
  const [appointments, setAppointments] = useState([]);
  const [timeLeft, setTimeLeft] = useState({})
  const [newDoctorName, setNewDoctorName] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [showAddDoctorPopup, setShowAddDoctorPopup] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [quote, setQuote] = useState('');
  const card = useRef(null);


  //function to handle patient login
  const handlePatientLogin = () => {
    localStorage.setItem('isLoggedIn', 'patient');
    setIsPatient(true);
    setIsDoctor(false);
    window.location.href = '/patient.html';
  };

  //function to handle doctor login
  const handleDoctorLogin = () => {
    localStorage.setItem('isLoggedIn', 'doctor');
    setIsPatient(false);
    setIsDoctor(true);
    window.location.href = '/doctor.html';
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem('isLoggedIn');
    if (loggedInUser === 'patient') {
      setIsPatient(true);
      setIsDoctor(false);
    }
    else if (loggedInUser === 'doctor') {
      setIsPatient(false);
      setIsDoctor(true);
    }
  }, []);


  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const handleClick = () => {
    ref1.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleClick2 = () => {
    ref2.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    fetchData().then(data => {
      if (data) {
        setQuote(data);
      }
    });
  }, []);
  useEffect(() => {
    runAnimation();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().then(data => {
        if (data) {
          setQuote(data);
        }
      });
    }, 10000); //10 sec
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetchData().then(data => {
      if (data) {
        setQuote(data);
      }
    });
  }, []);
  const addDoctor = () => {
    //checking if the doctor's name already exists
    if (newDoctorName.trim() === '' || selectedField.trim() === '') {
      alert('Please enter doctor name and select field.');
      return;
    }
    if (doctors.some(doctor => doctor.name.toLowerCase() === newDoctorName.toLowerCase())) {
      alert('Doctor name already exists.');
      return;
    }

    //adding the new doctor
    const newDoctor = {
      id: doctors.length + 1,
      name: newDoctorName,
      field: selectedField
    };
    setDoctors([...doctors, newDoctor]);
    setNewDoctorName('');
    setSelectedField('');
    setShowAddDoctorPopup(false);
  };

  const addAppointment = (doctor) => {
    const newAppointment = { name: doctor.name, field: doctor.field, date: '', time: '' };
    setAppointments([...appointments, newAppointment]);

    // Calculate and store time left for the new appointment
    const now = new Date();
    const appointmentDate = new Date(newAppointment.date + 'T' + newAppointment.time);
    const timeDiff = appointmentDate.getTime() - now.getTime();
    setTimeLeft(prevTimeLeft => ({ ...prevTimeLeft, [appointments.length]: timeDiff }));
  };

  useEffect(() => {
    // Update time left every minute
    const interval = setInterval(() => {
      setAppointments((prevAppointments) => {
        const updatedAppointments = prevAppointments.map((appointment, index) => {
          const now = new Date();
          const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
          const timeDiff = appointmentDate.getTime() - now.getTime();
          setTimeLeft(prevTimeLeft => ({ ...prevTimeLeft, [index]: timeDiff }));
          return appointment;
        });
        return updatedAppointments;
      });
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // Retrieve appointments from local storage
    const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    setAppointments(storedAppointments);
  }, []);

  const handleContactUsClick = () => {
    window.location.href = '/contact.html';
  };
  const removeAppointment = (index) => {
    const updatedAppointments = [...appointments];
    updatedAppointments.splice(index, 1);
    setAppointments(updatedAppointments);
  };

  // gsap.to(".card",{duration:1,x:-100});
  return (
    <div className="antialiased text-black w-full flex flex-col justify-center items-center text-center overflow-x-hidden">
      <section className="sec-loading">
        <div className="one">
        </div>
      </section>
      <div className="header_landing w-full">
        <Header
          isPatient={isPatient}
          isDoctor={isDoctor}
          handlePatientLogin={handlePatientLogin}
          handleDoctorLogin={handleDoctorLogin}
          handleClick2={handleClick2}
          handleContactUsClick={handleContactUsClick}
          setShowAddDoctorPopup={setShowAddDoctorPopup}
        />
        <div className="body_main w-full pt-28 relative flex flex-col justify-evenly">
          {/* <BasicParallax> */}
          <div className="main_heading absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-blue-200 text-8xl main_heading1">Your Home for Health</h1>
          </div>
          <div className="body_main w-full flex justify-evenly">
            <div className="quotes h-64 w-96 overflow-y-auto text-center text-2xl flex flex-col items-center justify-center">
              <h1 className="text-8xl whitespace-nowrap font-medium text-blue-900">Words of Wellness:</h1>
              <br />
              {quote}
            </div>
            <div className="flex justify-center">
              <img src={doctsign} alt="doct_sign" className="text-white doct_sign" />
            </div>
          </div>
          <div className="main_disc absolute">
            <h1 className="text-2xl">Medical Appointment Site</h1>
            <p className="text-gray-700">
              A medical appointment site facilitates convenient scheduling with healthcare providers. Users create profiles, inputting personal and medical data, then browse available slots offered by various professionals. Features include appointment booking, reminders, and telemedicine integration. Users search for practitioners based on specialty and location, aided by reviews and ratings. The platform streamlines access to healthcare, promoting efficient management of appointments and reducing missed visits.</p>
            <hr className="border-t-4 border-red-500 rounded-lg mx-20" />
          </div>
          {/* </BasicParallax> */}
        </div>
      </div>

      <div className="body_docts w-full">
        <div className="w-full docts_cards">
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Who You Wanna See?</h1>
                <p ref={ref2} className="lg:w-1/2 w-full leading-relaxed text-gray-500">Below are all the types of Doctors on our site.</p>
              </div>
              <div className="flex flex-wrap -m-4">
                <div className="xl:w-1/3 md:w-1/2 p-4 card1" onClick={handleClick}>
                  <div className="card_inside border border-blue-900 p-6 rounded-lg">
                    <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Cardiologists</h2> <p className="leading-relaxed text-xl">Cardiologists: Specialize in heart health, treating conditions like heart disease.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card2" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Audiologists</h2> <p className="leading-relaxed text-xl">Audiologists: Focus on hearing and balance issues in patients.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card3" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Dentist</h2> <p className="leading-relaxed text-xl">Dentists: Treat oral health problems and maintain dental hygiene.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4   card1" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">ENT Specialist</h2> <p className="leading-relaxed text-xl">ENT Specialists: Manage ear, nose, and throat conditions.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card2" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Gynecologist</h2> <p className="leading-relaxed text-xl">Gynecologists: Specialize in women's reproductive health.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card3" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Orthopedic Surgeon</h2> <p className="leading-relaxed text-xl">Orthopedic Surgeons: Treat musculoskeletal injuries and conditions.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card1" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Paediatrician</h2> <p className="leading-relaxed text-xl">Paediatricians: Provide healthcare for children from infancy to adolescence.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card2" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900  title-font mb-2">Psychiatrists</h2> <p className="leading-relaxed text-xl">Psychiatrists: Diagnose and treat mental health disorders.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card3" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Veterinarian</h2> <p className="leading-relaxed text-xl">Veterinarians: Provide medical care for animals.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card1" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Radiologist</h2> <p className="leading-relaxed text-xl">Radiologists: Interpret medical imaging such as X-rays and MRIs.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card2" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Pulmonologist</h2> <p className="leading-relaxed text-xl">Pulmonologists: Specialize in respiratory conditions and diseases.</p> </div> </div> <div className=" xl:w-1/3 md:w-1/2 p-4 card3" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Endocrinologist</h2> <p className="leading-relaxed text-xl">Endocrinologists: Manage hormonal disorders.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card1" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Oncologist</h2> <p className="leading-relaxed text-xl">Oncologists: Diagnose and treat cancer.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card2" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Neurologist</h2> <p className="leading-relaxed text-xl">Neurologists: Focus on disorders of the nervous system.</p> </div> </div> <div className="xl:w-1/3 md:w-1/2 p-4 card3" onClick={handleClick}> <div className="border border-blue-900 p-6 rounded-lg"> <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4"> <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"> <path d="M22 12h-4l-3 9-9-18-3 9H2"></path> </svg> </div> <h2 className="text-xl text-gray-900 title-font mb-2">Cardiothoracic Surgeon</h2> <p className="leading-relaxed text-xl">Cardiothoracic Surgeons: Perform surgeries on the heart and chest.</p> </div> </div> </div>
              <button ref={ref1} className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-2xl" onClick={handleContactUsClick}>Help</button>
            </div>
            <div className="flex justify-center">
              <hr className="border-t-4 border-red-500 rounded-lg w-5/12 mt-10" />
            </div>
          </section>
        </div>
        <div className="doct_appointments w-full" >
          {fields.map((field, index) => {
            const doctorsForField = doctors.filter(doctor => doctor.field === field);
            if (doctorsForField.length > 0) {
              return <FieldDoctors key={index} field={field} doctors={doctorsForField} addAppointment={addAppointment} />;
            }
            return null;
          })}
          <div className="flex justify-center">
            <hr className="border-t-4 border-red-500 rounded-lg w-5/12 mt-10" />
          </div>
          <h1 className="text-5xl mt-8">Appointments</h1>
          <div className="flex flex-wrap w-fulf justify-center p-2">
            {appointments.map((appointment, index) => (
              <div className=" about_appt w-1/1 p-2 border m-3 rounded-lg border-blue-100" key={index}>
                <p className="text-xl">{appointment.name} - {appointment.field}</p>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center">
                    <input type="date" className="border rounded-lg px-2 py-1 mr-2 bg-blue-100" />
                    <input type="time" className="border rounded-lg px-2 py-1 mr-2 bg-blue-100" />
                  </div>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => removeAppointment(index)}>Cancel</button>
                </div>
              </div>

            ))}
          </div>
          {showAddDoctorPopup && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-4 rounded-lg">
                <input
                  type="text"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  placeholder="Enter doctor's name"
                  className="border rounded px-2 py-1 mr-2"
                />
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="border rounded px-2 py-1 mr-2"
                >
                  <option value="">Select Field</option>
                  {fields.map((field, index) => (
                    <option key={index} value={field}>{field}</option>
                  ))}
                </select>
                <button className="border border-black rounded-lg px-4 py-2 bg-gray-100 font-medium cursor-pointer" onClick={addDoctor}>Add Doctor</button>
                <button className="border border-black rounded-lg px-4 py-2 ml-2 bg-gray-100 font-medium cursor-pointer" onClick={() => setShowAddDoctorPopup(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <section className="text-gray-400 bg-blue-100 body-font m-10">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="text-2xl font-medium title-font mb-4 text-red-500">OUR TEAM</h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
            </div>
            <div className="team flex flex-wrap -m-4">
              <div className="p-4 lg:w-1/4 md:w-1/2">
                <div className="h-full flex flex-col items-center text-center">
                  <img alt="team" className="flex-shrink-0 rounded-lg h-56 object-cover object-center mb-4" src={shwetank} />
                  <div className="w-full">
                    <h2 className="title-font font-medium text-lg text-red-500">Shwetank Dohroo</h2>
                    <h3 className="text-gray-500 mb-3">Full Stack</h3>
                    <p className="mb-4">I need Sleep</p>
                    <span className="inline-flex">
                      <a className="text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:w-1/4 md:w-1/2">
                <div className="h-full flex flex-col items-center text-center">
                  <img alt="team" className="flex-shrink-0 rounded-lg h-56 object-cover object-center mb-4" src={sidhant} />
                  <div className="w-full">
                    <h2 className="title-font font-medium text-lg text-red-500">Sidhant Singh</h2>
                    <h3 className="text-gray-500 mb-3">Data Analytics</h3>
                    <p className="mb-4">Liberary Bitha do</p>
                    <span className="inline-flex">
                      <a className="text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:w-1/4 md:w-1/2">
                <div className="h-full flex flex-col items-center text-center">
                  <img alt="team" className="flex-shrink-0 rounded-lg h-56 object-cover object-center mb-4" src={patel} />
                  <div className="w-full">
                    <h2 className="title-font font-medium text-lg text-red-500">Sidharth Patel</h2>
                    <h3 className="text-gray-500 mb-3">bhraman</h3>
                    <p className="mb-4"></p>
                    <span className="inline-flex">
                      <a className="text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:w-1/4 md:w-1/2">
                <div className="h-full flex flex-col items-center text-center">
                  <img alt="team" className="flex-shrink-0 rounded-lg h-56 object-cover object-center mb-4" src={surya} />
                  <div className="w-full">
                    <h2 className="title-font font-medium text-lg text-red-500">Surya Dev Singh</h2>
                    <h3 className="text-gray-500 mb-3">UI Developer</h3>
                    <p className="mb-4">NONE</p>
                    <span className="inline-flex">
                      <a className="text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                      </a>
                      <a className="ml-2 text-gray-700">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <hr className="border-t-4 border-red-500 rounded-lg w-5/12 mb-10" />
        </div>
      </div>

    </div>
  );
};


export default App;
