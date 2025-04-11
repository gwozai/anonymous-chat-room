
import { BehaviorSubject, Subject, scan, map, takeUntil } from 'rxjs';
import { RoomMetadata, TokenResult } from '../types';
export type curState = {
    join: boolean
    isAdmin: boolean,
    roomName?: string,
    hassPass?: boolean,
    roomMetadata?: RoomMetadata,
    token?: TokenResult
}

export const curState$ = new BehaviorSubject<curState>({
    join: false,
    isAdmin: false,
    roomName: '',
    hassPass: false,
    roomMetadata: undefined,
    token: undefined as TokenResult | undefined,
});
