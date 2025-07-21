import { State } from "./State";

class TrafficLight {
  id: string;
  state: State;
  constructor(id: string, state: State) {
    this.id = id;
    this.state = state;
  }

  setState(state: State): void {
    this.state = state;
  }

  setId(id: string): void {
    this.id = id;
  }

  getState(): State {
    return this.state;
  }
}

export { TrafficLight };
