/* SignIn Page */

import {React} from 'react';
import {useForm} from 'react-hook-form';
import {useCookies} from 'react-cookie';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Divider } from '@material-ui/core';

import {useHistory} from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer, toast} from 'react-toastify';

import logo from '../../imgs/logo.png';

// ======== Importación de funciones para interacción con API ======== //
import { userAuthentication } from '../../api/users';

// ======== Importación de estilos ======== //
import appMainStyles from '../../styles/main';

// ======== SweetAlert2 ======== //
import Swal from 'sweetalert2';
import withReactConcent from 'sweetalert2-react-content';
const SwalObj = withReactConcent(Swal);


const useStyles = appMainStyles;

export default function PasswordRecovery() {
  const classes = useStyles();
  const history = useHistory();
  const [cookies, setCookie] = useCookies();
  const {register, handleSubmit, formState: {errors}} = useForm();

  /* Envío de formulario al backend para autenticación de usuario */
  const login = async (formData) => {
      try {
          /* Se realiza el proceso de recuperación de contraseña */
          console.log(formData);

          toast.success('¡Listo! Si el correo electrónico existe recibirás un link de recuperación.');

      } catch (error) {
        if (error.response) {
          // Error en API de autenticación (usar toast)

          return SwalObj.fire({
            title: '¡Ups!',
            text: error.response.data.message ? error.response.data.message : 'Se ha producido un error. Inténtalo nuevamente más tarde.',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4D4D4D',
            icon: 'error'
          });

        }  
        console.log(error);

        SwalObj.fire({
          title: '¡Ups!',
          text: 'Se ha producido un error. Inténtalo nuevamente más tarde.',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4D4D4D',
          icon: 'error'
      });
      }
  };

  return (
    <div className={classes.mainContainer}>

      <ToastContainer />

      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} className={classes.paper}>
        <img src={logo} alt="" />
        <Box m={2}>
        <ToastContainer />
        <Divider className={classes.divider} />
        <Typography  className={classes.cardTitle} component="h1" variant="h5">
          <Box fontWeight="fontWeightBold">
            Recuperación de contraseña
          </Box>
        </Typography>

        <Typography variant="subtitle1">
            <Box style={{marginTop: '10px'}}>
                Ingresa el correo electrónico con el cual te encuentras registrado. Recibirás un correo de recuperación.
            </Box>
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(login)}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            type="email"
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            {...register('email', {required: true})}
          />
          {errors.email && <span style={{color: '#D41D1D'}}>* Este campo es obligatorio.</span>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Ingresar
          </Button>
          <Grid container>
            <Grid item>
              <Link style={{cursor: 'pointer'}} onClick={() => history.push('/signIn')} variant="body2">
                {'Iniciar sesión'}
              </Link>
            </Grid>
          </Grid>
        </form>
        </Box>
      </Paper>
    </Container>
    </div>
  );
}