import {useState} from "react";


function Login({ attemptLogin }) {
    const [input, setInput] = useState("");
    console.log(attemptLogin("test"))

    return (
        <>
            <h1>Login</h1>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={input} placeholder="Name" onChange={(e) => setInput(e.target.value)} />

            <button onClick={() => attemptLogin(input)}>OK</button>
        </>
    );
}

export default Login;
