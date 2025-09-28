
import { BehaviorSubject, Subject, scan, map, takeUntil, share } from 'rxjs';
import { BackendType, RoomMetadata, TokenResult } from '../types';
import { presets } from '@/lib/const';
export type curState = {
    join: boolean
    isAdmin: boolean,
    roomName?: string,
    hassPass?: boolean,
    roomMetadata?: RoomMetadata,
    token?: TokenResult,
    backend?: BackendType,
    videoPreset?: typeof presets[0]
}

export const curState$ = new BehaviorSubject<curState>({
    join: false,
    isAdmin: false,
    roomName: '',
    hassPass: false,
    roomMetadata: undefined,
    token: undefined as TokenResult | undefined,
    backend: undefined,
    videoPreset: presets[0]
});

// 创建共享数据流
export const sharedCurState$ = curState$.pipe(
    share()
  );