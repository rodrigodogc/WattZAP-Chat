import { useEffect, useState } from 'react';
import './App.css'
import { IoSend, IoSendOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import mqtt from 'mqtt';

function Chat() {

  const [inputMsgText, setInputMsgText] = useState('')
  const [randomColor, setRandomColor] = useState('gray')
  const [randomName, setRandomName] = useState('')
  const [mqttApi, setMqttApi] = useState(null)
  const [lastMessage, setLastMessage] = useState({})
  const [lastMessages, setLastMessages] = useState({})
  const [conectadoBroker, setConectadoBroker] = useState(false)

  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt')
    client.on('connect', () => {
      console.log('Conectado ao broker...')
      setConectadoBroker(true)
      generateRandomColor()
      generateRandomName()
      setMqttApi(client)
      client.subscribe('wattzap/chat', (err) => {
        if (!err) {
          console.log('Inscrito no tópico "wattzap/chat"')
        }
      });
    });

    client.on('message', (topic, message) => {
      const jsonMsg = JSON.parse(message)
      setLastMessage(jsonMsg)
      console.log(jsonMsg);
      setLastMessages((lastMsgs) => ({
        [`message${Object.keys(lastMsgs).length + 1}`]: {
          content: jsonMsg.content,
          sender: jsonMsg.sender,
          color: jsonMsg.color
        },
        ...lastMsgs
      }))
    });

    client.on('disconnect', (topic, message) => {
      setConectadoBroker(false)
    })

    client.on('error', (err) => {
      console.error('Erro na conexão MQTT:', err);
    });

    return () => {
      client.end();
    };
  }, []);

  const handleSendMessage = () => {
    if (!mqttApi || inputMsgText.length < 1) return
    mqttApi.publish('wattzap/chat', JSON.stringify({
      content: inputMsgText,
      sender: randomName,
      color: randomColor
    }))
    setInputMsgText('')
  }

  const generateRandomColor = () => {
    const colors = [
      "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1",
      "#955251", "#B565A7", "#009B77", "#DD4124", "#D65076",
      "#45B8AC", "#EFC050", "#5B5EA6", "#9B2335", "#DFCFBE",
      "#55B4B0", "#E15D44", "#7FCDCD", "#BC243C", "#C3447A"
    ];
    const randColorSeed = Math.floor(Math.random() * colors.length);
    const corRandomica = colors[randColorSeed]
    setRandomColor(corRandomica)
    return corRandomica
  }

  const generateRandomName = () => {
    const animais = [
      "Leão", "Tigre", "Elefante", "Girafa", "Zebra",
      "Macaco", "Panda", "Canguru", "Gorila", "Rinoceronte",
      "Hipopótamo", "Crocodilo", "Pinguim", "Orca", "Tubarão",
      "Águia", "Falcão", "Coruja", "Gato", "Cachorro"
    ];
    const indiceAleatorio = Math.floor(Math.random() * animais.length);
    const nomeAleatorio = animais[indiceAleatorio]
    setRandomName(nomeAleatorio)
    return nomeAleatorio;
  }

  if (!conectadoBroker) {
    return (
      <div className='mainChatContainer' style={{ flexDirection: 'column' }}>
        <div style={{ fontSize: 23 }}>Pera ae que ta carregando xD</div>
        <img
          style={{
            borderRadius: 200,
            marginTop: 15,
            width: 200,
            height: 200,
          }}
          src='https://i.giphy.com/8m4R4pvViWtRzbloJ1.webp'
        />
      </div>
    )
  }

  return (
    <div className='mainChatContainer'>
      <div className='barraSuperior'>
        <img
          className='logoWatt'
          src='https://wattconsultoria.com.br/wp-content/uploads/2023/10/Logo-Branca.png'
        />
        <div className='fonteLogo'>
          attZAP
        </div>
        <div className='userInfoBox'>
          <FaUserCircle
            size={18}
            color={randomColor}
          />
          <div style={{ color: randomColor }}>
            {randomName}
          </div>
        </div>
      </div>
      <div className='messagesContainer'>
        {Object.keys(lastMessages).map((key) => {
          const msg = lastMessages[key];
          return (
            <div className='messageBox' key={key}>
              <div className='nameImageBox'>
                <FaUserCircle
                  size={18}
                  color={msg.color}
                />
                <div className='userName' style={{ color: msg.color }}>
                  {msg.sender}
                </div>
              </div>
              <div className='messageText'>
                {msg.content}
              </div>
            </div>
          )
        })}
      </div>
      <div className='chatInputContainer'>
        <input
          className='chatInput'
          autoFocus={false}
          value={inputMsgText}
          onChange={(e) => setInputMsgText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          type='text'
        >
        </input>
        <button className='sendButton' onClick={handleSendMessage}>
          {inputMsgText.length > 0 ?
            <IoSend size={40} />
            :
            <IoSendOutline size={40} />
          }
        </button>
      </div>
    </div>
  )
}

export default Chat
