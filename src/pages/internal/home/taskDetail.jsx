import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import CircleIcon from '@mui/icons-material/Circle';
import Checkbox from '@mui/material/Checkbox';

import InfoIcon from '@mui/icons-material/Info';

import {useForm} from 'react-hook-form';

import { ToastContainer, toast } from 'react-toastify';

import { makeStyles } from "@material-ui/core";

// ======== Importación de funciones para interacción con API ======== //
import {getUserSubjects} from '../../../api/subjects';
import { modifyUserTask } from '../../../api/tasks';

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

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
      backgroundColor: '#0e4b50',
      color: '#FFF'
    }
  }));

const DetailReadOnly = ({task}) => {

    return <>
        {task.description ? (
            <>
                <Typography style={{marginTop: '10px'}}><strong>Descripción</strong>:</Typography>
                <Typography style={{marginTop: '10px'}}>
                    {task.description}
                </Typography>
            </>
                
            )
            : null}
        <Typography style={{marginTop: '20px'}}><strong>Asignatura</strong>: {task.subjectName}</Typography>
        <Typography style={{marginTop: '20px'}}><strong>Fecha de registro</strong>: {task.createdAt}</Typography>
        <Typography style={{marginTop: '20px'}}><strong>Fecha de vencimiento</strong>: {task.deadline}</Typography>

        {task.notifyAt ? <Typography style={{marginTop: '20px'}}><strong>Fecha de notificación</strong>: {task.notifyAt}</Typography> : null}

        {task.isObligatory ? <Typography style={{marginTop: '20px'}}><InfoIcon style={{color: '#0e4b50'}} /> <strong>Esta tarea es obligatoria.</strong></Typography> : null}
        <Typography style={{marginTop: '20px'}}><InfoIcon style={{color: '#0e4b50'}} /> <strong>Quedan {task.daysRemaining} días restantes para vencimiento de la tarea.</strong></Typography>

        <Typography style={{marginTop: '20px'}}><InfoIcon style={{color: '#0e4b50'}} /> <strong>Esta tarea tiene prioridad {priorityIcons[task.priority].label}</strong></Typography>

    </>
};

const DetailForm = ({task, loadTaskList, setOpenTaskDetail}) => {
    const [cookies, setCookies] = useCookies();
    const [priority, setPriority] = useState(task.priority);
    const [subjectList, setSubjectList] = useState([]);
    const [priorityText, setPriorityText] = useState(priorityIcons[task.priority].label);
    const [selectedSubject, setSelectedSubject] = useState(parseInt(task.subjectId));
    const [openAddSubjectDialog, setOpenAddSubjectDialog] = useState(false);
    const {register, handleSubmit, reset, formState: {errors, isSubmitSuccessful}} = useForm();
    const loadUserSubjects = async () => {
        let response = await getUserSubjects(cookies.currentUser, cookies.accessToken);
        if (response.status === 200) {
            setSubjectList(response.data.subjectList);
        }
    };

    const priorityChange = (event, newValue) => {
        if (newValue === null) {
          return;
        }
        setPriority(newValue);
        setPriorityText(priorityIcons[newValue].label);
    
    };

    const onSubjectSelectChange = (event) => {
        setSelectedSubject(event.target.value);
    }

    useEffect(() => {
        loadUserSubjects();
    }, []);

    const modifyTask = async (formData) => {
        formData.priority = priority;
        formData.taskId = task.id;

        let response = await modifyUserTask(cookies.currentUser, cookies.accessToken, formData);

        if (response.status >= 400 && response.status <= 511) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
        }

        setOpenTaskDetail(false);
        loadTaskList();
    };

    return <form onSubmit={handleSubmit(modifyTask)}>
        <TextField
              defaultValue={task.title}
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
              defaultValue={task.description}
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
              defaultValue={task.deadline}
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
              defaultValue={task.notifyAt}
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
                  <InputLabel>Selecciona una asignatura</InputLabel>
                  <Select
                    fullWidth
                    value={selectedSubject}
                    label="Asignatura"
                    {...register('subjectId', { required: true})}
                    onChange={onSubjectSelectChange}
                >
                  {subjectList.map((subject, index) => {
                    return <MenuItem  
                      selected={subject.name === task.subjectName ? true : false}
                      value={subject.id} 
                      key={'subject-item-' + index}>
                      {subject.name}
                    </MenuItem>
                  })}
                </Select>
                {errors.subjectId && <span style={{color: '#D41D1D'}}>* Este campo es obligatorio.</span>}
            </FormControl>

            <FormGroup style={{marginTop: '10px'}}>
              <FormControlLabel control={<Checkbox defaultChecked={task.isObligatory ? true : false} {...register('isObligatory', {required:false})} />} label="¿Es obligatoria?" />
            </FormGroup>
            
            <Typography component="legend" style={{marginTop: '10px'}}>Prioridad: <strong>{priorityText}</strong></Typography>
            <Rating style={{marginTop: '10px', color: '#0e4b50'}} name="read-only" value={priority} onChange={priorityChange} IconContainerComponent={IconContainer} />

            <div style={{marginTop: '10px'}}>
                <Button type="submit" variant="contained" color="success">Guardar</Button>
            </div>
    </form>
};

export default function TaskDetailDialog ({openTaskDetail, setOpenTaskDetail, task, loadTaskList}) {
    const classes = useStyles();
    const [modifyDetail, setModifyDetail] = useState(false);

    const changeDetailMode = () => {
        setModifyDetail(!modifyDetail);
    }

    return <>
    <ToastContainer />

    {task ? 
        <Dialog fullWidth open={openTaskDetail} onClose={() => { setOpenTaskDetail(false) }}>
        <DialogTitle className={classes.dialogTitle}>{task.title}</DialogTitle>
        <DialogContent>
            {modifyDetail ? <DetailForm setOpenTaskDetail={setOpenTaskDetail} loadTaskList={loadTaskList} task={task} /> : <DetailReadOnly task={task} />}
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color={modifyDetail ? 'error' : 'warning'} onClick={changeDetailMode}>
                {modifyDetail ? 'Cancelar modificación' : 'Modificar datos'}
            </Button>
            {modifyDetail ? null
            : <Button variant="outlined" color="error" onClick={() => { setOpenTaskDetail(false) }}>Cerrar</Button>}
        </DialogActions>
    </Dialog>
        : null
    }

    </>
}