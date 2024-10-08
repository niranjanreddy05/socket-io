import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'



const socket = io('http://localhost:3000', {
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts before giving up
  reconnectionDelay: 1000, // Delay before reconnection attempts
});
function App() {
  const [msg, setMsg] = useState([]);
  const [msgFormData, setMsgFormData] = useState({ message: '' });
  const [roomFormData, setRoomFormData] = useState({ room: '' });

  useEffect(() => {
    socket.on('connect', () => {
      setMsg(prevData => {
        return [...prevData, `You connected to the sever with id: ${socket.id}`]
      })
    })

    socket.on('receive-message', (msg) => {
      setMsg(prevData => {
        return [...prevData, msg]
      })
    })

    return () => {
      socket.off('connect')
      socket.off('receive-message')
    }
  }, [])

  function updateMsgForm(e) {
    setMsgFormData(prevData => {
      return { ...prevData, [e.target.name]: e.target.value }
    })
  }

  function updateRoomForm(e) {
    setRoomFormData(prevData => {
      return { ...prevData, [e.target.name]: e.target.value }
    })
  }

  function sendMsg(e) {
    e.preventDefault();
    if (msgFormData === '') return;
    setMsg(prevData => {
      return [...prevData, msgFormData.message]
    })
    socket.emit('send-message', msgFormData.message, roomFormData.room)
    console.log(roomFormData.room)
    setMsgFormData({ message: '' });
  }

  function joinRoom(e) {
    e.preventDefault();
    socket.emit('join-room', roomFormData.room, (data) => {
      setMsg(prevData => {
        return [...prevData, data]
      })
    })
  }

  return (
    <>
      <div style={{
        height: 500,
        width: 900,
        border: '1px solid black',
        overflow: 'scroll'
      }}>
        {msg.map((m, i) => {
          return <div key={i}>{m}</div>
        })}
      </div>
      <form>
        <div>
          <p>Message</p>
          <input type='text' name='message' value={msgFormData.message} onChange={(e) => updateMsgForm(e)}></input>
          <button onClick={(e) => sendMsg(e)}>Send</button>
        </div>
        <div>
          <p>Room</p>
          <input type='text' name='room' value={roomFormData.room} onChange={(e) => updateRoomForm(e)} ></input>
          <button onClick={(e) => joinRoom(e)}>Join</button>
        </div>
      </form>
    </>
  )
}

export default App
