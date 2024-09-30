import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';
import Login from "@/entrypoints/popup/login/Login.tsx";


function App() {
  const [name, setName] = useState(0);

  function attemptLogin( name ) {
      console.log(`Attempt login wiht ${name}`)
  }

  if (!name) {
      browser.runtime.sendMessage({
          action: "new-tab"
      });

      return (
        <>
            <Login attemptLogin={(login : string) => attemptLogin(login)}></Login>
        </>
      );
  } else {
      return (
          <>
              <div id="header">
                  <img src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg" alt=""/>
              </div>
              <div id="body">
                  <Login attemptLogin={(login : string) => attemptLogin(login)}></Login>
              </div>
          </>
      );
  }

}

export default App;
