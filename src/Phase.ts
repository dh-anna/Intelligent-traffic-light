import { State } from "./State";

class Phase {
  id: string;
  duration: number;
  states: State[];

  constructor(id: string, duration: number, states: State[]) {
    this.id = id;
    this.duration = duration;
    this.states = states;
  }

  getStates(): State[] {
    return this.states;
  }
}

export { Phase };
