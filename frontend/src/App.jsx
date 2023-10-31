import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("/")

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSumit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: "me"
    }
    setMessages([...messages, newMessage])
    socket.emit("message", message)

  };
  useEffect(() => {
    socket.on("message", receiveMessage);
    return () => {
      socket.off("message", receiveMessage);
    };
  }, [])
  const receiveMessage = message => {
    setMessages((state) => [...state, message]);
  }
  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSumit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Grupo: Usuarios</h1>
        <input type="text" placeholder="Escribe tu mensaje" onChange={(e) => setMessage(e.target.value)} className="border-2 border-zinc-500 p-2 w-full text-black" />
        <ul>
          {
            messages.map((message, i) => (
              <li key={i} className={`my-2 p-2 table rounded-md ${message.from === "Me" ? "bg-#ffff-700 ml-auto" : "bg-black-1500 ml-auto"
            }`}>
              <span className="text-xs text-slate-500 block">{message.from}</span>:<span className="text-sm">{message.body}</span></li>
              
            ))
          }

        </ul>
      </form>
    </div>
  )
}
export default App;