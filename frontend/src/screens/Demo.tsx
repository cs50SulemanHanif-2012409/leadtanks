import { useEffect , useState } from "react";
import { socket } from "../utils/socket";


export default function Demo(){
    const [isConnected, setIsConnected] = useState(socket.connected);
  
    useEffect(() => {

        socket.connect()

      function onConnect() {
        setIsConnected(true);
      }
  
      function onDisconnect() {
        setIsConnected(false);
      }
  
  
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('jamal-response-chuck', (message)=>{
        console.log(message)
      });
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      };
    }, []);
    return <div> Connected : {isConnected ? 'YES' : 'NO' }</div>
}