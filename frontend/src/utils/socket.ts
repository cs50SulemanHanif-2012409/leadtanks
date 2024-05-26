import { io } from 'socket.io-client';

const URL : string  =  'http://localhost:8080';

export const socket = io(URL);