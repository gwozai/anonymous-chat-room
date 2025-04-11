import { NextApiRequest, NextApiResponse } from 'next';

import { AccessToken, RoomServiceClient, TokenVerifier } from 'livekit-server-sdk';
import { RoomMetadata, TokenResult } from '../../lib/types';
import { lru } from '@/lib/lru';

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const wsUrl = process.env.LIVEKIT_URL;

type REQ_BODY = {
    roomName: string
    metadata?:RoomMetadata
}
export default async function updateRoomMetadata(req: NextApiRequest, res: NextApiResponse) {
    // 验证 Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    // 验证 LiveKit token
    const tv = new TokenVerifier(apiKey || '', apiSecret || '');
    const claims = tv.verify(token);
    if (!claims) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { roomName, metadata } = req.body as REQ_BODY;

    if(metadata == undefined) return res.status(500).json({ error: "please provide metadata"});

    if (typeof roomName !== 'string' ) {
      res.status(403).end();
      return;
    }

    if (!apiKey || !apiSecret || !wsUrl) {
      return res.status(500).json({ error: "Server misconfigured" });
    }
  
    const livekitHost = wsUrl?.replace("wss://", "https://");
    try{
        const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);
        roomService.updateRoomMetadata(
            roomName,
            JSON.stringify(metadata)
        )
        const t: RoomMetadata = metadata
        lru.set(roomName, t)
    }catch(e){
        return res.status(500).json({ error: 'setting metadata error'})
    }

    return res.status(200).json(metadata);
}
