'use client'
import React, { useState, useRef } from 'react'
import { Fade } from "react-awesome-reveal";
import Button from '@mui/material/Button';
import Agenda from '../agenda/Agenda'
import Navbar from '../Navbar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GiFireDash } from "react-icons/gi";
import './Home.css'
import { CiPlay1, CiPause1 } from 'react-icons/ci';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      light: grey[300],
      main: grey[500],
      dark: grey[700],
      darker: grey[900],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          width: 360,
          height: 60,
          borderRadius: 10,
          textAlign: 'center',
          border: '2px solid #fff',
          fontFamily: 'Roboto',
          textTransform: 'none',
          color: '#fff'

        },
      },
    },
  },
});


const Home = ({ handleConfirmBooking, handleCancelBooking, fetchBookings, fetchClosedDatesFromFirebase, fetchWorkingDaysFromFirebase }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const [showAgenda, setShowAgenda] = useState(false);

  const [isVideoPlaying, setIsVideoPlaying] = useState(true); // Track video playing state
  const videoRef = useRef(null);


  const handleAgendaOpen = () => {
    setShowAgenda(true);
  };

  const handleAgendaClose = () => {
    setShowAgenda(false);
  };




  const handlePlayPauseVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };




  {/* absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-1 */ }
  return (
    <div className="home">
      <video autoPlay loop muted className=" bg-vid blur-md filter" ref={videoRef} >
        <source className='' src="/1.mp4" type="video/mp4" />

      </video>
      <Fade bottom distance="40px" style={{ zIndex: 1 }}>
        <div className='flex flex-col items-center ' >
          <div className="w-60 h-60 p-2 my-2">
            <img
              className="rounded-full border-2 border-white w-full  mb-4"
              alt="profile"
              src="/logo.jpeg"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {showAgenda ? (
            <Agenda handleConfirmBooking={handleConfirmBooking} handleCancelBooking={handleCancelBooking} fetchBookings={fetchBookings} onClose={handleAgendaClose} fetchWorkingDaysFromFirebase={fetchWorkingDaysFromFirebase} fetchClosedDatesFromFirebase={fetchClosedDatesFromFirebase} />
          ) : (
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAgendaOpen}
                style={{ backgroundColor: 'rgba(48, 52, 68, 0.5)' }}
              >
                Agenda agora <GiFireDash className="p-2 w-10 h-10" color="#fff" />
              </Button>

            </ThemeProvider>)}

        </div>
      </Fade>
      <div className='absolute top-[10%] right-[10%] z-1 '>

        {isVideoPlaying ?
          <CiPause1 className="p-2 rounded-lg  border-2 border-white w-12 h-12" color="white" onClick={handlePlayPauseVideo} />
          : <CiPlay1 className="p-2 rounded-lg  border-2 border-white w-12 h-12" color="white" onClick={handlePlayPauseVideo} />}

      </div>

      <Navbar />
    </div>
  )
}

export default Home