import { useState } from 'react'

function App(){
  const [message,setMessage] = useState('')

  function handleClick(){
    fetch('http://127.0.0.1:8000/settle',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        paid: { Prachi: 7000, Riya: 2000, Ananya: 1000, Sneha: 0 },
        fair_share: { Prachi: 2500, Riya: 2500, Ananya: 2500, Sneha: 2500 }
      })
    })
    .then(response => response.json())
    .then(data => setMessage(JSON.stringify(data.settlements)))
}

 return (
    <div>
      <h1>SmartSplit</h1>
      <button onClick={handleClick}>Calculate Settlements</button>
      <p>{message}</p>
    </div>
  )
}

export default App
