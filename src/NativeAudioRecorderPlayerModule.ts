import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';
import type { AudioSet, PlayBackType, RecordBackType } from './index.d'


interface Spec extends TurboModule {
  addRecordBackListener: (
    callback: (recordingMeta: RecordBackType) => void,
  ) => void;
  removeRecordBackListener: () => void;
  addPlayBackListener: (
    callback: (playbackMeta: PlayBackType) => void,
  ) => void;
  removePlayBackListener: () => void;
  startRecorder: (
    uri?: string,
    audioSets?: AudioSet,
    meteringEnabled?: boolean,
  ) => Promise<string>;
  pauseRecorder: () => Promise<string>;
  resumeRecorder: () => Promise<string>;
  stopRecorder: () => Promise<string>;
  resumePlayer: () => Promise<string>;
  startPlayer: (
    uri?: string,
    httpHeaders?: Record<string, string>,
  ) => Promise<string>;
  stopPlayer: () => Promise<string>;
  pausePlayer: () => Promise<string>;
  seekToPlayer: (time: number) => Promise<string>;
  setVolume: (volume: number) => Promise<string>;
  setSubscriptionDuration: (sec: number) => Promise<string>;
}

export default TurboModuleRegistry.get<Spec>('RNAudioRecorderPlayerTurboModule')