 
import DarkVeil from './components/DarkVeil';
import './App.css'
import Welcome from './components/Welcome';

function App() {

  const loggedIn = false;

  return (
    <>
      
      {loggedIn ?
      (
        <>
        <nav>
        <h1>StageGo</h1>
      </nav>
        <main>
          <h2>Welcome back!</h2>
        </main>
        </>
      )
      :
      (
        <>
          <Welcome />
        </>
      )}
    </>
  )
}

export default App
