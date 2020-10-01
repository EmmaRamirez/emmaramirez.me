# Typing Redux Actions

Figured I'd show you here how I structure my Redux Actions


```typescript
export interface Action<T extends string, P = unkown> {
    type: T;
    payload?: P extends object ? P : null;
    readonly meta?: any;
}

export interface Start {
    start: boolean
}

export type StartGame = 
export const 'START_GAME = 'START_GAME';

export const StartGame = ({ start }: Start): Action<START_GAME, Start> =>
    ({ type: 'START_GAME' })
```

Note: You can chain the conditional type to allow payloads with strings or numbers, etc.

And that's it! There's some more stuff you can do with reducers though:

```typescript
export interface State {
    Game: {
        start: boolean;
    }
}

export const game = (state: State['Game'], action: Action<START_GAME>) => {
    switch (action.type) {
        case START_GAME:
            return { start: action.payload.start };
        default:
            return state;
    }
}
```

It'd probably be nice to use [pattern matching](https://github.com/tc39/proposal-pattern-matching) once it lands in Ecmascript.

The main thing about these types is that you should tailor them to your needs. While I do think this is a good starting type, it certainly isn't an end-all be-all of typing redux actions & reducers. Another option might be a library with stronger typing such as [undux](https://github.com/bcherny/undux).