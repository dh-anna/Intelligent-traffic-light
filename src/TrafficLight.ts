enum TrafficLightState {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green'
}

interface CycleConfig {
  redDuration: number;
  yellowDuration: number;
  greenDuration: number;
  maxSpeed?: number;
  customYellowDuration?: number;
}

class TrafficLight {
  private currentState: TrafficLightState;
  private cycleConfig: CycleConfig;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private cycleCount: number = 0;
  private isRunning: boolean = false;

  constructor(cycleConfig?: Partial<CycleConfig>) {
    this.currentState = TrafficLightState.RED;
    this.cycleConfig = {
      redDuration: 30000,
      yellowDuration: 5000,
      greenDuration: 25000,
      maxSpeed: 50,
      ...cycleConfig
    };
    this.updateYellowDuration();
  }

  getCurrentState(): TrafficLightState {
    return this.currentState;
  }

  getCycleCount(): number {
    return this.cycleCount;
  }

  isActive(): boolean {
    return this.isRunning;
  }

  setTime(state: TrafficLightState, duration: number): void {
    switch (state) {
      case TrafficLightState.RED:
        this.cycleConfig.redDuration = duration;
        break;
      case TrafficLightState.YELLOW:
        this.cycleConfig.yellowDuration = duration;
        break;
      case TrafficLightState.GREEN:
        this.cycleConfig.greenDuration = duration;
        break;
    }
  }

  setCycleConfig(config: Partial<CycleConfig>): void {
    this.cycleConfig = { ...this.cycleConfig, ...config };
    this.updateYellowDuration();
  }

  setMaxSpeed(speed: number): void {
    this.cycleConfig.maxSpeed = speed;
    this.updateYellowDuration();
  }

  setCustomYellowDuration(duration?: number): void {
    this.cycleConfig.customYellowDuration = duration;
    this.updateYellowDuration();
  }

  private updateYellowDuration(): void {
    if (this.cycleConfig.customYellowDuration !== undefined) {
      this.cycleConfig.yellowDuration = this.cycleConfig.customYellowDuration;
    } else {
      this.cycleConfig.yellowDuration = this.computeYellowDuration();
    }
  }

  private computeYellowDuration(): number {
    const maxSpeed = this.cycleConfig.maxSpeed || 50;
    
    const speedMps = (maxSpeed * 1000) / 3600;
    
    return Math.max(speedMps * 1000, 3000);
  }

  getCycleConfig(): CycleConfig {
    return { ...this.cycleConfig };
  }

  setState(state: TrafficLightState): void {
    this.currentState = state;
    this.onStateChange(state);
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
    this.currentState = TrafficLightState.RED;
    this.cycleCount = 0;
  }

  private cycle(): void {
    if (!this.isRunning) return;

    const currentDuration = this.getCurrentDuration();
    
    this.timer = setTimeout(() => {
      const nextState = this.getNextState();
      this.setState(nextState);
      
      if (nextState === TrafficLightState.RED) {
        this.cycleCount++;
      }
      
      this.cycle();
    }, currentDuration);
  }

  private getCurrentDuration(): number {
    switch (this.currentState) {
      case TrafficLightState.RED:
        return this.cycleConfig.redDuration;
      case TrafficLightState.YELLOW:
        return this.cycleConfig.yellowDuration;
      case TrafficLightState.GREEN:
        return this.cycleConfig.greenDuration;
      default:
        return 0;
    }
  }

  private getNextState(): TrafficLightState {
    switch (this.currentState) {
      case TrafficLightState.RED:
        return TrafficLightState.GREEN;
      case TrafficLightState.GREEN:
        return TrafficLightState.YELLOW;
      case TrafficLightState.YELLOW:
        return TrafficLightState.RED;
      default:
        return TrafficLightState.RED;
    }
  }

  private onStateChange(state: TrafficLightState): void {
    console.log(`Traffic light changed to: ${state.toUpperCase()} (Cycle: ${this.cycleCount})`);
  }
}

export { TrafficLight, TrafficLightState };