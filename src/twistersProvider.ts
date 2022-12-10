export interface Twister {
    text: string
}

export interface TwistersState {
    twisters: Twister[]
    currentTwisterIndex: number;
}

export class TwistersStateModifier {

    newState = (twisters: string[]): TwistersState => {
        return {
            twisters: twisters.map((t, i) => ({
                text: t,
            })),
            currentTwisterIndex: 0
        };
    }

    current(current: TwistersState): Twister {
        return current.twisters[current.currentTwisterIndex];
    }

    next(current: TwistersState): TwistersState {
        return {
            ...current,
            currentTwisterIndex: current.currentTwisterIndex + 1
        }
    }


    prev(current: TwistersState) {
        return {
            ...current,
            currentTwisterIndex: current.currentTwisterIndex - 1
        }
    }

    isFirst(current: TwistersState) {
        return current.currentTwisterIndex === 0;
    }

    isLast(current: TwistersState) {
        return current.currentTwisterIndex + 1 === current.twisters.length;
    }

    numberOfTwisters(current: TwistersState): number {
        return current.twisters.length;
    }

    random(twisters: TwistersState): TwistersState {
        return {
            ...twisters,
            currentTwisterIndex: Math.floor(Math.random() * twisters.twisters.length)
        };
    }

    setTwister(twisters: TwistersState, value: number) {
        return {
            ...twisters,
            currentTwisterIndex: value - 1
        };
    }

    currentTwisterNumber(twisters: TwistersState) {
        return twisters.currentTwisterIndex + 1;
    }
}