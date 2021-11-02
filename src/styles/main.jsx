/* Estilos utilizados para la vista de inicio de sesión */
import { makeStyles } from "@material-ui/core";

const appMainStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '10px',
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
      cardTitle: {
          textAlign: 'center'
      },
      mainContainer: {
        position: 'absolute',
        margin: 0,
        padding: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'linear-gradient(0deg, rgba(29,153,162,1) 0%, rgba(14,72,77,1) 100%)'
      },
      box: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      divider: {
        marginTop: theme.spacing(-2),
        marginBottom: theme.spacing(2)
      }
}));

export default appMainStyles;