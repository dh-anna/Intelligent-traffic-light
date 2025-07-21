import { Phase } from "./Phase";
import { TrafficLight } from "./TrafficLight";

class Junction {
  private phases: Phase[];
  private trafficLights: TrafficLight[];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private currentPhase: Phase | undefined;
  private cycleCount: number = 0;
  private currentDuration: number | undefined;
  private isRunning: boolean = false;

  constructor(phases: Phase[], trafficLights: TrafficLight[]) {
    this.phases = phases;
    this.trafficLights = trafficLights;
  }
  isActive(): boolean {
    return this.isRunning;
  }

  setphase(phase: Phase): void {
    this.currentPhase = phase;
    for (let j = 0; j < this.trafficLights.length; j++) {
      this.trafficLights[j].setState(phase.states[j]);
    }
    this.onPhaseChange(phase);
  }
  private onPhaseChange(phase: Phase): void {
    for (let i = 0; i < this.trafficLights.length; i++) {
      console.log(
        `Id:${this.trafficLights[i].id}:  ${this.trafficLights[i].getState()} (Cycle: ${this.currentPhase?.duration})`,
      );
    }
  }

  private cycle(): void {
    if (!this.isRunning) return;

    const currentDuration = this.currentDuration;
    this.timer = setTimeout(() => {
      const nextPhase: Phase = this.getNextPhase();
      this.setphase(nextPhase);

      if (nextPhase === this.phases[0]) {
        this.cycleCount++;
      }

      this.cycle();
    }, currentDuration);
  }

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.cycle();
    }
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  reset(): void {
    this.stop();
    this.currentPhase = this.phases[0];
    this.cycleCount = 0;
  }

  getNextPhase(): Phase {
    let nextIndex = 0;
    if (this.currentPhase instanceof Phase) {
      nextIndex = this.phases.indexOf(this.currentPhase);
    }
    return this.phases[nextIndex];
  }
}

export { Junction };
