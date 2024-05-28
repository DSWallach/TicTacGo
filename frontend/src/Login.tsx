import React, {useState} from 'react';
import {useAuth} from './Auth';


const Login: React.FC = () => {
    const { login } = useAuth();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleLogin = () => {
        const user = { id: '123', username };
        login(user);
    };

    return (
        <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
