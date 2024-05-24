import React, {useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('https://localhost:8080')
    .then(responce => response.json())
    .then(data => setMessage(data.text))
    .catch(error => console.error("Error fetching data: ", error))
    
  }, []);

  return (
    <div>
      <h1> This is React </h1>
      <p> Message: {message} </p>
    </div>
  );
}

export default App;