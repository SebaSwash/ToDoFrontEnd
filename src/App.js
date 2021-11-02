import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

/* ================ Importación de páginas ================ */

// Páginas externas
import SignIn from './pages/external/signIn';
import PasswordRecovery from './pages/external/passwordRecovery';

// Componentes
import MainDrawer from './components/internal/drawer';

// Páginas internas
import UserHome from './pages/internal/home/index';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0e4a4f'
    }
  }
});

function App() {

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path='/signIn'>
              <SignIn></SignIn>
            </Route>
            <Route exact path='/passwordRecovery'>
              <PasswordRecovery></PasswordRecovery>
            </Route>
            <Route exact path='/home'>
              <MainDrawer>
                <UserHome/>
              </MainDrawer>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
      
    </div>
  );
}

export default App;
