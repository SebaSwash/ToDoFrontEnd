import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {useForm} from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { ToastContainer, toast } from 'react-toastify';

import CircleIcon from '@mui/icons-material/Circle';

import { makeStyles } from "@material-ui/core";

import AddSubjectDialog from './addSubject';

// ======== Importación de funciones para interacción con API ======== //
import {addUserTask, getUserTaskList} from '../../../api/tasks';
import {getUserSubjects} from '../../../api/subjects';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: '#0e4b50',
    color: '#FFF'
  }
}));

const priorityIcons = {
  1: {
    icon: <CircleIcon style={{marginRight: '10px'}} />,
    label: 'Muy baja',
  },
  2: {
    icon: <CircleIcon style={{marginRight: '10px'}} />,
    label: 'Baja',
  },
  3: {
    icon: <CircleIcon style={{marginRight: '10px'}} />,
    label: 'Intermedia',
  },
  4: {
    icon: <CircleIcon style={{marginRight: '10px'}} />,
    label: 'Alta',
  },
  5: {
    icon: <CircleIcon style={{marginRight: '10px'}} />,
    label: 'Muy alta',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{priorityIcons[value].icon}</span>;
}

export default function AddTaskDialog({openAddTaskDialog, setOpenAddTaskDialog, loadTaskList}) {
  const classes = useStyles();
  const [cookies, setCookies] = useCookies();
  const [priority, setPriority] = useState(1);
  const [openAddSubjectDialog, setOpenAddSubjectDialog] = useState(false);
  const [priorityText, setPriorityText] = useState('Muy baja');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const {register, handleSubmit, reset, formState: {errors, isSubmitSuccessful}} = useForm();

  const handleClose = () => {
    setOpenAddTaskDialog(false);
  };

  const loadSubjectList = async () => {
    let response = await getUserSubjects(cookies.currentUser, cookies.accessToken);
    setSubjectList(response.data.subjectList);
  };

  const addNewTask = async (formData) => {
    formData.priority = priority;
    let response = await addUserTask(cookies.currentUser, cookies.accessToken, formData);

    if (response.status === 201) {
        // Creación exitosa
        toast.success(response.data.message);
    } else if (response.status >= 400 && response.status <= 510) {
        // Error en la creación
        toast.error(response.data.message);
    }

    loadTaskList(); // Se carga nuevamente la lista de tareas
    handleClose(); // Se cierra el modal de registro de tarea
    reset(); // Reset de los campos del formulario
  };

  const onSubjectSelectChange = (event) => {
    setSelectedSubject(event.target.value);
  }

  const priorityChange = (event, newValue) => {
    if (newValue === null) {
      return;
    }
    setPriority(newValue);
    setPriorityText(priorityIcons[newValue].label);

  };

  useEffect(async () => {
    await loadSubjectList();
  }, []);

  return (
    <div>
      <ToastContainer />

      <Dialog fullWidth open={openAddTaskDialog} onClose={handleClose}>
        <DialogTitle className={classes.dialogTitle}>Agregar nueva tarea</DialogTitle>
        <form onSubmit={handleSubmit(addNewTask)}>
          <DialogContent>
            <DialogContentText style={{marginTop: '10px'}}>
                Agrega una nueva tarea y mantén un registro que te permita organizar tus tiempos.
            </DialogContentText>
            <TextField
              autoFocus
              name="title"
              margin="dense"
              id="title"
              label="Título"
              type="text"
              fullWidth
              variant="filled"
              style={{marginTop: '10px'}}
              {...register('title', {required: true})}
            />
            {errors.title && <span style={{color: '#D41D1D'}}>* Este campo es obligatorio.</span>}
            <TextField
              name="description"
              id="description"
              label="Descripción"
              multiline
              rows={4}
              fullWidth
              variant="filled"
              style={{marginTop: '10px'}}
              {...register('description')}
            />
            <TextField
              name="deadline"
              id="deadline"
              label="Fecha límite"
              type="datetime-local"
              fullWidth
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginTop: '10px'}}
              {...register('deadline', {required: true})}
            />
            {errors.deadline && <span style={{color: '#D41D1D'}}>* Este campo es obligatorio.</span>}
            <TextField
              name="notifyAt"
              id="notifyAt"
              label="Notificar en"
              type="datetime-local"
              fullWidth
              helperText="Fecha y hora a la que se desea recibir la notificación de alerta."
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginTop: '10px'}}
              {...register('notifyAt')}
            />

                <FormControl style={{marginTop: '10px', minWidth: '100%'}} variant="filled">
                  <InputLabel id="demo-simple-select-filled-label">Selecciona una asignatura</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth
                    value={selectedSubject}
                    label="Asignatura"
                    {...register('subjectId', { required: true})}
                    onChange={onSubjectSelectChange}
                    onFocus={async () => {await loadSubjectList()}}
                >
                  {subjectList.map((subject, index) => {
                    return <MenuItem 
                      selected
                      value={subject.id} 
                      key={'subject-item-' + index}>
                      {subject.name}
                    </MenuItem>
                  })}
                </Select>
                {errors.subjectId && <span style={{color: '#D41D1D'}}>* Este campo es obligatorio.</span>}
              </FormControl>

            <Button 
              style={{marginTop: '10px'}} 
              size="small" 
              variant="contained" 
              color="success" 
              type="button"
              onClick = {() => {setOpenAddSubjectDialog(!openAddSubjectDialog)}}
            >
              Agregar asignatura
            </Button>

            <FormGroup style={{marginTop: '10px'}}>
              <FormControlLabel control={<Checkbox defaultValue={false} {...register('isObligatory', {required:false})} />} label="¿Es obligatoria?" />
            </FormGroup>
            

            <Typography component="legend" style={{marginTop: '10px'}}>Prioridad: <strong>{priorityText}</strong></Typography>
            <Rating style={{marginTop: '10px', color: '#0e4b50'}} name="read-only" value={priority} onChange={priorityChange} IconContainerComponent={IconContainer} />

          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" color="success" type="submit">Agregar</Button>
          </DialogActions>
        </form>

        <AddSubjectDialog 
          openAddSubjectDialog={openAddSubjectDialog} 
          setOpenAddSubjectDialog={setOpenAddSubjectDialog} 
          loadSubjectList={loadSubjectList}
        />

      </Dialog>
    </div>
  );
}