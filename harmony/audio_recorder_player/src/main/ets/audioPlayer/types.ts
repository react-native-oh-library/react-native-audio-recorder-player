export const TAG: string = 'Audio_Player';

export const playBackName: string = 'rn-playback';

export enum EventTarget {
  durationUpdate = 'durationUpdate',
  timeUpdate = 'timeUpdate',
  stateChange = 'stateChange',
  error = 'error',
  seekDone = 'seekDone',
  volumeChange = 'volumeChange',
  seekToPlayer = 'seekToPlayer',
  setVolume = 'setVolume',
}

export enum AVPlayerState {
  idle = 'idle',
  initialized = 'initialized',
  prepared = 'prepared',
  playing = 'playing',
  paused = 'paused',
  completed = 'completed',
  stopped = 'stopped',
  released = 'released',
  error = 'error',
}

export enum processValue {
  play = 'playing',
  resume = 'Already playing',
  stop = 'Already stopped playing',
  pause = 'Already paused playing',
  noPlaying = 'No audio playing',
  stateError = 'current state is not allowed',
}

export const pathStartWith: Array<string> = ['fd://', 'http://', 'https://'];
