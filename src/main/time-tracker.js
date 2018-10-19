export default class TimeTracker {
  elapsedTime = 0;

  constructor(callable) {
    this.callable = callable;
  }

  async execute() {
    const startTime = Date.now();
    const value = await this.callable();
    const finishTime = Date.now();

    this.elapsedTime = finishTime - startTime;

    return value;
  }
}
