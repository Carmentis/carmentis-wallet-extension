import '../style.css'
import Login from "@/entrypoints/popup/login/Login.tsx";
import {Route, Routes} from "react-router";


function App() {

  return <>
      <Routes>
          <Route path="/" element={< Login />}></Route>
      </Routes>
  </>;
}

export default App;
