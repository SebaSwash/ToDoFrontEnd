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


function Copyright() {
  return (
    <Typography style={{color: 'white'}} variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        ToDo (Sebastián Toro Severino)
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = appMainStyles;

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const [cookies, setCookie] = useCookies();
  const {register, handleSubmit, formState: {errors}} = useForm();

  /* Envío de formulario al backend para autenticación de usuario */
  const login = async (formData) => {
      try {
        /* Se realiza el proceso de autenticación */
        let response = await userAuthentication(formData);

        setCookie('accessToken', response.data.accessToken);
        setCookie('currentUser', JSON.stringify({
          id: response.data.userId,
          email: response.data.email,
          fullname: response.data.fullname
        }));

        history.push('/home');

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
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} className={classes.paper}>
        <img src={logo} alt="" />
        <Box m={2}>
        <ToastContainer />
        <Divider className={classes.divider} />
        <Typography  className={classes.cardTitle} component="h1" variant="h5">
          <Box fontWeight="fontWeightBold">
            Iniciar sesión
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
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', {required: true})}
          />
            {errors.password && <span style={{color: '#D41D1D'}}>* Este campo es obligatorio.</span>}

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
            <Grid item xs>
              <Link style={{cursor: 'pointer'}} onClick={() => history.push('/passwordRecovery')} variant="body2">
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {'¿Aún no tienes una cuenta?'}
              </Link>
            </Grid>
          </Grid>
        </form>
        </Box>
      </Paper>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </div>
  );
}