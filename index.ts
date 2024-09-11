import type { EmitterSubscription } from 'react-native';
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  TurboModuleRegistry
} from 'react-native';


const RNAudioRecorderPlayer = TurboModuleRegistry ? require('./src/NativeAudioRecorderPlayerModule').default : NativeModules.RNAudioRecorderPlayer;

export enum AudioSourceHarmonyType {
  DEFAULT = 0,
  MIC,
  VOICE_RECOGNITION,
  VOICE_COMMUNICATION = 7,
  VOICE_MESSAGE = 10,
  CAMCORDER = 12,
}

export enum AudioFormatHarmonyType {
  MPEG_4 = 'mp4',
  MPEG_4A = 'm4a',
  MP3 = 'mp3',
  WAV = 'wav'
}

export enum AudioMimeHarmonyType {
  AUDIO_AAC = 'audio/mp4a-latm', // 表示音频/mp4a-latm类型。

  AUDIO_VORBIS = 'audio/vorbis',	// 	表示音频/vorbis类型。
  AUDIO_FLAC = 'audio/flac',	// 	表示音频/flac类型。
  AUDIO_MP3 = 'audio/mpeg',	// 	表示音频/mpeg类型。
  AUDIO_G711MU = 'audio/g711mu',	// 	表示音频/G711-mulaw类型。
}

export enum AudioSourceAndroidType {
  DEFAULT = 0,
  MIC,
  VOICE_UPLINK,
  VOICE_DOWNLINK,
  VOICE_CALL,
  CAMCORDER,
  VOICE_RECOGNITION,
  VOICE_COMMUNICATION,
  REMOTE_SUBMIX,
  UNPROCESSED,
  RADIO_TUNER = 1998,
  HOTWORD,
}

export enum OutputFormatAndroidType {
  DEFAULT = 0,
  THREE_GPP,
  MPEG_4,
  AMR_NB,
  AMR_WB,
  AAC_ADIF,
  AAC_ADTS,
  OUTPUT_FORMAT_RTP_AVP,
  MPEG_2_TS,
  WEBM,
  UNUSED,
  OGG,
}

export enum AudioEncoderAndroidType {
  DEFAULT = 0,
  AMR_NB,
  AMR_WB,
  AAC,
  HE_AAC,
  AAC_ELD,
  VORBIS,
  OPUS,
}

export enum AVEncodingOption {
  lpcm = 'lpcm',
  ima4 = 'ima4',
  aac = 'aac',
  MAC3 = 'MAC3',
  MAC6 = 'MAC6',
  ulaw = 'ulaw',
  alaw = 'alaw',
  mp1 = 'mp1',
  mp2 = 'mp2',
  mp4 = 'mp4',
  alac = 'alac',
  amr = 'amr',
  flac = 'flac',
  opus = 'opus',
  wav = 'wav',
}

type AVEncodingType =
  | AVEncodingOption.lpcm
  | AVEncodingOption.ima4
  | AVEncodingOption.aac
  | AVEncodingOption.MAC3
  | AVEncodingOption.MAC6
  | AVEncodingOption.ulaw
  | AVEncodingOption.alaw
  | AVEncodingOption.mp1
  | AVEncodingOption.mp2
  | AVEncodingOption.mp4
  | AVEncodingOption.alac
  | AVEncodingOption.amr
  | AVEncodingOption.flac
  | AVEncodingOption.opus
  | AVEncodingOption.wav;

export enum AVModeIOSOption {
  gamechat = 'gamechat',
  measurement = 'measurement',
  movieplayback = 'movieplayback',
  spokenaudio = 'spokenaudio',
  videochat = 'videochat',
  videorecording = 'videorecording',
  voicechat = 'voicechat',
  voiceprompt = 'voiceprompt',
}

export type AVModeIOSType =
  | AVModeIOSOption.gamechat
  | AVModeIOSOption.measurement
  | AVModeIOSOption.movieplayback
  | AVModeIOSOption.spokenaudio
  | AVModeIOSOption.videochat
  | AVModeIOSOption.videorecording
  | AVModeIOSOption.voicechat
  | AVModeIOSOption.voiceprompt;

export enum AVEncoderAudioQualityIOSType {
  min = 0,
  low = 32,
  medium = 64,
  high = 96,
  max = 127,
}

export enum AVLinearPCMBitDepthKeyIOSType {
  'bit8' = 8,
  'bit16' = 16,
  'bit24' = 24,
  'bit32' = 32,
}

export interface AudioSet {
  AVSampleRateKeyIOS?: number;
  AVFormatIDKeyIOS?: AVEncodingType;
  AVModeIOS?: AVModeIOSType;
  AVNumberOfChannelsKeyIOS?: number;
  AVEncoderAudioQualityKeyIOS?: AVEncoderAudioQualityIOSType;
  AudioSourceAndroid?: AudioSourceAndroidType;
  AVLinearPCMBitDepthKeyIOS?: AVLinearPCMBitDepthKeyIOSType;
  AVLinearPCMIsBigEndianKeyIOS?: boolean;
  AVLinearPCMIsFloatKeyIOS?: boolean;
  AVLinearPCMIsNonInterleavedIOS?: boolean;
  AVEncoderBitRateKeyIOS?: number;
  OutputFormatAndroid?: OutputFormatAndroidType;
  AudioEncoderAndroid?: AudioEncoderAndroidType;
  AudioEncodingBitRateAndroid?: number;
  AudioSamplingRateAndroid?: number;
  AudioChannelsAndroid?: number;
  AudioSourceHarmony?: AudioSourceHarmonyType;
  AudioMimeHarmony?: AudioMimeHarmonyType;
  AudioFileFormatHarmony?: AudioFormatHarmonyType;
  /**
  * 音频编码比特率，选择音频录制时必填。

支持范围：

- AAC编码格式支持比特率范围[32000 - 500000]。

- G711-mulaw编码格式支持比特率范围[64000 - 64000]。

- MP3编码格式支持范围[8000, 16000, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 160000, 192000, 224000, 256000, 320000]。

当使用MP3编码格式时，采样率和比特率的映射关系：

- 采样率使用16K以下时，对应比特率范围为[8kbps - 64kbps]。

- 采样率使用16K~32K时对应的比特率范围为[8kbps - 160kbps]。

- 采样率使用32K以上时对应的比特率范围为[32kbps - 320kbps]。
  */
  AudioEncodingBitRateHarmony?: number;
  /**
   * 支持范围：
  
  - AAC编码支持采样率范围[8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000, 64000, 88200, 96000]。
  
  - G711-mulaw编码支持采样率范围[8000 - 8000]。
  
  - MP3编码支持采样率范围[8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000]。
   */
  AudioSamplingRateHarmony?: number;
  /**
   * 音频采集声道数
  
  - AAC编码格式支持范围[1 - 8]。
  
  - G711-mulaw编码格式支持范围[1 - 1]。
  
  - MP3编码格式支持范围[1 - 2]
   */
  AudioChannelsHarmony?: number;
}

const pad = (num: number): string => {
  return ('0' + num).slice(-2);
};

export type RecordBackType = {
  isRecording?: boolean;
  currentPosition: number;
  currentMetering?: number;
};

export type PlayBackType = {
  isMuted?: boolean;
  currentPosition: number;
  duration: number;
  isFinished: boolean;
};

class AudioRecorderPlayer {
  private _isRecording: boolean;
  private _isPlaying: boolean;
  private _hasPaused: boolean;
  private _hasPausedRecord: boolean;
  private _recorderSubscription: null | EmitterSubscription;
  private _playerSubscription: EmitterSubscription;
  private _playerCallback: null | ((event: PlayBackType) => void);

  mmss = (secs: number): string => {
    let minutes = Math.floor(secs / 60);

    secs = secs % 60;
    minutes = minutes % 60;

    return pad(minutes) + ':' + pad(secs);
  };

  mmssss = (milisecs: number): string => {
    const secs = Math.floor(milisecs / 1000);
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    const miliseconds = Math.floor((milisecs % 1000) / 10);

    return pad(minutes) + ':' + pad(seconds) + ':' + pad(miliseconds);
  };

  /**
   * Set listerner from native module for recorder.
   * @returns {callBack((e: RecordBackType): void)}
   */

  addRecordBackListener = (
    callback: (recordingMeta: RecordBackType) => void,
  ): void => {
    if (Platform.OS === 'android') {
      this._recorderSubscription = DeviceEventEmitter.addListener(
        'rn-recordback',
        callback,
      );
    } else {
      const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayer);

      this._recorderSubscription = myModuleEvt.addListener(
        'rn-recordback',
        callback,
      );
    }
  };

  addListener(name: string, callback: (data: any) => void) {
    if (Platform.OS === 'android') {
      this._recorderSubscription = DeviceEventEmitter.addListener(
        name,
        callback,
      );
    } else {
      const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayer);

      this._recorderSubscription = myModuleEvt.addListener(
        name,
        callback,
      );
    }
  }
  /**
   * Remove listener for recorder.
   * @returns {void}
   */
  removeRecordBackListener = (): void => {
    if (this._recorderSubscription) {
      this._recorderSubscription.remove();
      this._recorderSubscription = null;
    }
  };

  /**
   * Set listener from native module for player.
   * @returns {callBack((e: PlayBackType): void)}
   */
  addPlayBackListener = (
    callback: (playbackMeta: PlayBackType) => void,
  ): void => {
    this._playerCallback = callback;
  };

  /**
   * remove listener for player.
   * @returns {void}
   */
  removePlayBackListener = (): void => {
    this._playerCallback = null;
  };

  /**
   * start recording with param.
   * @param {string} uri audio uri.
   * @returns {Promise<string>}
   */
  startRecorder = async (
    uri?: string,
    audioSets?: AudioSet,
    meteringEnabled?: boolean,
  ): Promise<string> => {
    if (!this._isRecording) {
      this._isRecording = true;

      return RNAudioRecorderPlayer.startRecorder(
        uri ?? 'DEFAULT',
        audioSets,
        meteringEnabled ?? false,
      );
    }

    return 'Already recording';
  };

  /**
   * Pause recording.
   * @returns {Promise<string>}
   */
  pauseRecorder = async (): Promise<string> => {
    if (!this._hasPausedRecord) {
      this._hasPausedRecord = true;

      return RNAudioRecorderPlayer.pauseRecorder();
    }

    return 'Already paused recording.';
  };

  /**
   * Resume recording.
   * @returns {Promise<string>}
   */
  resumeRecorder = async (): Promise<string> => {
    if (this._hasPausedRecord) {
      this._hasPausedRecord = false;

      return RNAudioRecorderPlayer.resumeRecorder();
    }

    return 'Currently recording.';
  };

  /**
   * stop recording.
   * @returns {Promise<string>}
   */
  stopRecorder = async (): Promise<string> => {
    if (this._isRecording) {
      this._isRecording = false;
      this._hasPausedRecord = false;

      return RNAudioRecorderPlayer.stopRecorder();
    }

    return 'Already stopped';
  };

  /**
   * Resume playing.
   * @returns {Promise<string>}
   */
  resumePlayer = async (): Promise<string> => {
    if (!this._isPlaying) {
      return 'No audio playing';
    }

    if (this._hasPaused) {
      this._hasPaused = false;

      return RNAudioRecorderPlayer.resumePlayer();
    }

    return 'Already playing';
  };

  playerCallback = (event: PlayBackType): void => {
    if (this._playerCallback) {
      this._playerCallback(event);
    }

    if (event.isFinished) {
      this.stopPlayer();
    }
  };

  /**
   * Start playing with param.
   * @param {string} uri audio uri.
   * @param {Record<string, string>} httpHeaders Set of http headers.
   * @returns {Promise<string>}
   */
  startPlayer = async (
    uri?: string,
    httpHeaders?: Record<string, string>,
  ): Promise<string | undefined> => {
    if (!uri) {
      uri = 'DEFAULT';
    }

    if (!this._playerSubscription) {
      if (Platform.OS === 'android') {
        this._playerSubscription = DeviceEventEmitter.addListener(
          'rn-playback',
          this.playerCallback,
        );
      } else {
        const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayer);

        this._playerSubscription = myModuleEvt.addListener(
          'rn-playback',
          this.playerCallback,
        );
      }
    }

    if (!this._isPlaying || this._hasPaused) {
      this._isPlaying = true;
      this._hasPaused = false;

      return RNAudioRecorderPlayer.startPlayer(uri, httpHeaders);
    }
  };

  /**
   * Stop playing.
   * @returns {Promise<string>}
   */
  stopPlayer = async (): Promise<string> => {
    if (this._isPlaying) {
      this._isPlaying = false;
      this._hasPaused = false;

      return RNAudioRecorderPlayer.stopPlayer();
    }

    return 'Already stopped playing';
  };

  /**
   * Pause playing.
   * @returns {Promise<string>}
   */
  pausePlayer = async (): Promise<string | undefined> => {
    if (!this._isPlaying) {
      return 'No audio playing';
    }

    if (!this._hasPaused) {
      this._hasPaused = true;

      return RNAudioRecorderPlayer.pausePlayer();
    }
  };

  /**
   * Seek to.
   * @param {number} time position seek to in millisecond.
   * @returns {Promise<string>}
   */
  seekToPlayer = async (time: number): Promise<string> => {
    return RNAudioRecorderPlayer.seekToPlayer(time);
  };

  /**
   * Set volume.
   * @param {number} setVolume set volume.
   * @returns {Promise<string>}
   */
  setVolume = async (volume: number): Promise<string> => {
    if (volume < 0 || volume > 1) {
      throw new Error('Value of volume should be between 0.0 to 1.0');
    }

    return RNAudioRecorderPlayer.setVolume(volume);
  };

  /**
   * Set subscription duration. Default is 0.5.
   * @param {number} sec subscription callback duration in seconds.
   * @returns {Promise<string>}
   */
  setSubscriptionDuration = async (sec: number): Promise<string> => {
    return RNAudioRecorderPlayer.setSubscriptionDuration(sec);
  };
}

export default AudioRecorderPlayer;
