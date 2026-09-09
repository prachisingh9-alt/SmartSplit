import { useState } from 'react'

function App(){
  const [message,setMessage] = useState('')

  return (
    <div>
      <h1>SmartSplit</h1>
      <p>{message}</p>
    </div>
  )
}

export default App

