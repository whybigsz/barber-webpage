import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IoArrowBackCircle } from 'react-icons/io5';
import { RxCrossCircled } from "react-icons/rx";

// Function to generate a unique identifier
const generateUniqueIdentifier = () => {
  // Try to retrieve the identifier from localStorage
  let identifier = localStorage.getItem('browserIdentifier');

  // If the identifier is not present in localStorage, generate a new one
  if (!identifier) {
    // Generate a random identifier (you may use a more sophisticated method)
    identifier = Math.random().toString(36).substring(2, 15);

    // Store the identifier in both localStorage and a cookie
    localStorage.setItem('browserIdentifier', identifier);
    document.cookie = `browserIdentifier=${identifier}; max-age=${365 * 24 * 60 * 60}; path=/`;
  }

  return identifier;
};


const theme = createTheme({
  palette: {
    primary: {
      main: '#fff', // Set the primary color to white
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          border: 'solid white',
          backgroundColor: '#1c1c1c', // Set the background color to a darker blue
          color: '#fff', // Set the text color to white
          '&:hover': {
            backgroundColor: '#1c1c1c', // Make the background color slightly darker on hover
          },
          '&:disabled': {
            color: 'rgba(255, 255, 255, 0.3)', // Set your desired text color for the disabled state
          },
        },
      },
    },
  },
});

export const AgendaConfirm = ({ handleConfirmBooking, weekday, date, time, updateConfirmation, onClose }) => {

  const [success, setSuccess] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // When the user visits your site
  const uniqueIdentifier = generateUniqueIdentifier(); // Implement your own function
  localStorage.setItem('browserIdentifier', uniqueIdentifier);


  return (
    <ThemeProvider theme={theme}>
      {!success ? (
        <div className='flex flex-col'>
          <p className='text-white font-semibold text-lg'>Confirmação para {weekday} às {time}h</p>
          <div className='flex flex-col p-4'>
            <TextField
              className='caret-white'
              label='Nome'
              color={(name.length >= 3) ? 'success' : (name.length > 0 && name.length < 3 ? 'warning' : 'primary')}
              focused
              InputProps={{
                style: {
                  color: 'white',
                },
              }}
              style={{
                borderColor: '#fff',
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              className='mt-3 caret-white'
              label='Nº de Telefone'
              color={(cellphone.length === 9 && /^(91|93|96)/.test(cellphone)) ? 'success' : (cellphone.length > 0 ? 'warning' : 'primary')}
              focused
              InputProps={{
                style: {
                  color: 'white',
                },
                maxLength: 9,
              }}
              style={{
                borderColor: '#fff',
              }}
              value={cellphone}
              onChange={(e) => {
                // Ensure only numbers are entered
                const sanitizedValue = e.target.value.replace(/\D/g, '');

                // Limit the length to 9 digits
                const formattedValue = sanitizedValue.slice(0, 10);

                // Update the state with the formatted value
                setCellphone(formattedValue);
              }}
              error={cellphone.length > 9}
              helperText={
                <FormHelperText
                  style={{
                    color: 'white', // Set your desired text color
                    fontSize: '0.75rem', // Set your desired font size
                    marginTop: '4px', // Adjust the top margin as needed
                  }}
                >
                  {cellphone.length > 0 && (cellphone.length !== 9 || !/^(91|93|96)/.test(cellphone))
                    ? 'Insira um número válido.'
                    : ''
                  }
                </FormHelperText>
              }
            />
          </div>
          <div className='flex flex-col items-center'>
            <Button
              id='submit'
              label='Enviar'
              variant='contained'
              className='text-white rounded-lg'
              disabled={!(name.length >= 3 && cellphone.length === 9 && /^(91|93|96)/.test(cellphone))}
              onClick={() => {
                setSuccess(true);
                handleConfirmBooking(date, weekday, time, name, cellphone, uniqueIdentifier)
              }
              }
            >
              Confirmar
            </Button>
            <IoArrowBackCircle
              className='mt-3 w-10 h-10 cursor-pointer'
              color='white'
              onClick={updateConfirmation}
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center'> {/* Added items-center class here */}
          <h1 className='text-white text-2xl font-bold'>
            Olá {name}, agradecemos a tua marcação!
          </h1>
          <p className='mt-4 p-4 text-white font-semibold'>Dia marcação: {weekday} às {time}h </p>
          <p className='p-4 text-white font-semibold'>Data marcação: {formattedDate}</p>
          <div className="flex justify-center items-center"> {/* Added flex class here */}
            <RxCrossCircled
              className='mt-3 w-10 h-10 cursor-pointer'
              color='white'
              onClick={onClose}
            />
          </div>
        </div>
      )}
    </ThemeProvider>

  );
};
