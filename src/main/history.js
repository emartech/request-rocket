import { clone, equals } from 'ramda';
import { initialState } from '../renderer/store/index';

class StateHistory {
  constructor() {
    this.states = [];
    this.id = 0;
    this.states.push(clone(initialState));
  }

  getCurrentState() {
    return this.states[this.id];
  }

  currentEquals(state) {
    return equals(state.request, this.getCurrentState().request) && equals(state.auth, this.getCurrentState().auth);
  }

  push(state) {
    this.states.push(state);
    this.id = this.states.length - 1;
  }

  length() {
    return this.states.length;
  }

  previousState() {
    if (this.id > 0) this.id -= 1;
    return this.states[this.id];
  }

  nextState() {
    if (this.id < this.states.length - 1) this.id += 1;
    return this.states[this.id];
  }

  getStates() {
    return this.states;
  }

  setStates(states) {
    this.states = states;
    this.id = this.states.length - 1;
  }
}

export default StateHistory;
