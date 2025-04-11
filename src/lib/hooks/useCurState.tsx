import { useObservableState } from "@/livekit-react-offical/hooks/internal";
import { useEffect, useState } from "react";
import { curState$ } from "../observe/CurStateObs";
import { TokenResult } from "../types";

export function useCurState() {
    const mcurState = useObservableState(curState$, {
        join: false,
        isAdmin: false,
        roomName: '',
        hassPass: false,
        roomMetadata: undefined,
        token: undefined as TokenResult | undefined,
    });
    return mcurState
}

