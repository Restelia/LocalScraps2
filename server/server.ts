import { WebSocketServer, WebSocket } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`Server running on port ${PORT}`);

interface Room {
    buyer: WebSocket | null;
    seller: WebSocket | null;
}

const rooms = new Map<string, Room>();

wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://localhost:${PORT}`);
    const roomId = url.searchParams.get('roomId');
    const role = url.searchParams.get('role');

    if (!roomId || !role) {
        ws.close();
        return;
    }

    if (!rooms.has(roomId)) {
        rooms.set(roomId, { buyer: null, seller: null });
    }

    const room = rooms.get(roomId)!;

    if (role === 'buyer') room.buyer = ws;
    else if (role === 'seller') room.seller = ws;

    console.log(`${role} connected to room ${roomId}`);

    ws.on('message', (data: any) => {
        try {
            const message = JSON.parse(data.toString())
            const other = role === 'buyer' ? room.seller : room.buyer
            console.log(`${role} received message, other exists: ${other !== null}, ready state: ${other?.readyState}`)
            if (other && other.readyState === WebSocket.OPEN) {
                console.log(`${role} sending message to other client`)
                other.send(JSON.stringify(message))
            }
        } catch (err) {
            console.error('Parse error:', err)
        }
    })

    ws.on('close', () => {
        console.log(`${role} disconnected from room ${roomId}`)
        if (role === 'buyer' && room.buyer === ws) room.buyer = null
        else if (role === 'seller' && room.seller === ws) room.seller = null
    })
});

