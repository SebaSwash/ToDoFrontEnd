import {useState} from 'react';
import {useCookies} from 'react-cookie';
import {useForm} from 'react-hook-form';

import { ToastContainer, toast } from 'react-toastify';

import { makeStyles } from "@material-ui/core";
import { TwitterPicker } from 'react-color';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

// ======== Importación de funciones para interacción con API ======== //
import {addNewSubject} from '../../../api/subjects';

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
      backgroundColor: '#0e4b50',
      color: '#FFF'
    },
    
}));

export default function AddSubjectDialog({openAddSubjectDialog, setOpenAddSubjectDialog, loadSubjectList}) {
    const classes = useStyles();
    const [cookies, setCookies] = useCookies();
    const [currentColor, setCurrentColor] = useState('#FFFFFF');
    const {register, handleSubmit, formState: {errors}} = useForm();

    const handleClose = () => {
        setOpenAddSubjectDialog(false);
    };

    const onColorChange = (color, event) => {
        setCurrentColor(color.hex);
    };

    const submitNewSubject = async (formData) => {
        formData['color'] = currentColor;
        let response = await addNewSubject(cookies.currentUser, formData, cookies.accessToken);

        if (response.status === 201) {
            // Creación exitosa
            toast.success(response.data.message);
        } else if (response.status >= 400 && response.status <= 510) {
            // Error en la creación
            toast.error(response.data.message);
        }

        await loadSubjectList();
        setOpenAddSubjectDialog(false);
    };

    return (
        <div>
        <ToastContainer />

        <Dialog fullWidth open={openAddSubjectDialog} onClose={handleClose}>
            <DialogTitle className={classes.dialogTitle}>Agregar nueva asignatura</DialogTitle>
            <form onSubmit={handleSubmit(submitNewSubject)}>
                <DialogContent>
                    <DialogContentText style={{marginTop: '10px'}}>
                        Registra una nueva asignatura para poder asociarle tareas.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="filled"
                        {...register('name', {required: true})}
                    />
                    {errors.name && <span style={{color: '#D41D1D'}}>* Este campo es obligatorio.</span>}

                    <Typography component="legend" style={{marginTop: '10px', marginBottom: '10px'}}>Selecciona un color</Typography>

                    <TwitterPicker
                        style={{marginTop: '10px'}}
                        color={currentColor}
                        onChange={onColorChange}
                    />

                    <Typography variant="subtitle2" component="legend" style={{marginTop: '10px', marginBottom: '10px'}}>* Te permitirá poder distinguir y ordenar de mejor forma tus tareas según la asignatura asociada.</Typography>

                </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={handleClose}>Cancelar</Button>
                <Button variant="contained" color="success" type="submit">Agregar</Button>
            </DialogActions>
            </form>
        </Dialog>
        </div>
    );
}
