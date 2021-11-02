import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

import {
    Grid,
    Box,
    Paper,
    Button,
    Typography
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';

import CircularProgress from '@mui/material/CircularProgress';

import FactCheckIcon from '@mui/icons-material/FactCheck';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Rating from '@mui/material/Rating';


import { makeStyles } from "@material-ui/core";


// ======== Importación de funciones para interacción con API ======== //
import { getUserData } from '../../../api/users';
import { getUserTaskList } from '../../../api/tasks';

// ======== Importación de otros componentes ======== //
import CircularStatic from '../../../components/internal/circularProgress';
import AddTaskDialog from './addTask';
import TaskDetailDialog from './taskDetail';

const useStyles = makeStyles((theme) => ({
    tableHead: {
        backgroundColor: '#0e4b50'
    },
    taskLoader: {
        color: '#0e4b50',
        marginTop: '10px'
    },
    taskLoaderDiv: {
        textAlign: "center",
    }
}));

function UserHome () {
    const classes = useStyles();
    const [cookies, setCookies] = useCookies();
    const [userData, setUserData] = useState();
    const [taskList, setTaskList] = useState([]);
    const [openTaskDetail, setOpenTaskDetail] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loadingTaskList, setLoadingTaskList] = useState(true);
    const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);

    const loadTaskList = async () => {
        setLoadingTaskList(true);
        
        // Obtención de datos del usuario
        let response = await getUserData(cookies.currentUser, cookies.accessToken); 
        setUserData(response.data);

        // Obtención de lista de tareas asignadas
        response = await getUserTaskList(cookies.currentUser, cookies.accessToken);
        setTaskList(response.data.taskList);


        setLoadingTaskList(false);
    };

    const onAddTaskDialogChange = () => {
        setOpenAddTaskDialog(!openAddTaskDialog);
    };

    // Se genera un modal con el detalle de la tarea seleccionada
    const loadTaskDetail = (task) => {
        setSelectedTask(task);
        setOpenTaskDetail(true);
    }


    useEffect(async () => {
        loadTaskList();
    }, []);

    return (
        <>
            <Grid>
                <Paper style={{padding: '20px'}} elevation={1}>
                    <Typography variant="h5" component="div" gutterBottom>
                        <AssignmentIcon style={{marginRight: '10px'}} />
                        Tus tareas agendadas <Button onClick={() => onAddTaskDialogChange()} title="Agregar tarea" size="small" color="success" variant="contained">
                            <AddCircleIcon/>
                        </Button>
                        <hr />
                    </Typography>

                    {!loadingTaskList ? (
                        <div>
                            {taskList.length ? 
                                <List>
                                    {taskList.map((task, index) => {
                                        return (
                                            <ListItemButton
                                                style={index % 2 === 0 ? {backgroundColor: '#fafafa'} : {}}
                                                key={'task-item-id-' + task.id}
                                                onClick={() => loadTaskDetail(task)}
                                            >
                                            <ListItemIcon>
                                                <AssignmentIcon style={{color: task.subjectColor}} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={task.title}
                                                secondary={
                                                    <div>
                                                        <div>
                                                            <Rating style={{color: '#0e4b50'}} name="read-only" value={task.priority} readOnly />
                                                        </div>
                                                        <div>{task.subjectName}</div>
                                                        <div><strong>{task.daysRemaining + ' días restantes para la entrega.'}</strong></div>
                                                        {task.daysRemaining >= 0 ? null : <div>
                                                            <strong style={{color: '#ea394c'}}>* Esta tarea se encuentra atrasada.</strong>
                                                            </div>}
                                                        <div>
                                                        </div>
                                                    </div>
                                                }
                                                
                                            />
                                            <ListItemText style={{textAlign: 'right'}}>
                                                <Box>
                                                    <CircularStatic percentage={task.progress} />
                                                </Box>
                                            </ListItemText>
                                            </ListItemButton>
                                        )
                                    })}
                                </List>
                            : <Grid item className={classes.taskLoaderDiv}>
                                    <FactCheckIcon style={{width: 60, height: 60, marginTop: '30px'}} />
                                    <br />
                                
                                    <Typography variant="h6">
                                        <Box sx={{ fontWeight: 'bold', m: 1 }}>
                                            ¡Magnífico!
                                        </Box>
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        No tienes tareas pendientes. Es buen tiempo para descansar.
                                    </Typography>
                                </Grid>}
                        </div>
                    ): (
                        <Grid item style={{textAlign: "center"}} className={classes.taskLoaderDiv}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Buscando tus tareas...
                            </Typography>

                            <CircularProgress className={classes.taskLoader} />
                        </Grid>
                    )}

                    <AddTaskDialog loadTaskList={loadTaskList} openAddTaskDialog={openAddTaskDialog} setOpenAddTaskDialog={setOpenAddTaskDialog} />

                    <TaskDetailDialog loadTaskList={loadTaskList} setOpenTaskDetail={setOpenTaskDetail} openTaskDetail={openTaskDetail} task={selectedTask} />

                </Paper>
            </Grid>
        </>
    )
}


export default UserHome;