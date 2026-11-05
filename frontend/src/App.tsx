import { supabase } from './lib/supabase';
import './App.css'


function App() {
  return (
    <>
      <button onClick={() => supabase.auth.signOut()}>Odjava</button>
    </>
  )
}

export default App
