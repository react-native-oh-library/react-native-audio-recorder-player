/*
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { TurboModule, TurboModuleContext, } from '@rnoh/react-native-openharmony/ts';
import { media } from '@kit.MediaKit';
import { AudioSet } from '.';
import Recorder from './recorder/Recorder';
import { AVRecorderState, defaultBitrate, defaultChannels, defaultSampleRate, RecordBackName, } from './recorder/types';
import AudioPlayer from './audioPlayer/AudioPlayer';
import { AVPlayerState, EventTarget, playBackName, processValue, } from './audioPlayer/types';

export class RNAudioRecorderPlayerTurboModule extends TurboModule {
  public ctx: TurboModuleContext;
  private AVPlayerInstance: AudioPlayer;
  private AVRecorderInstance: Recorder;
  private subscriptionDuration: number = 500;
  private RecordBackListenerTimer;
  private PlayBackListenerTimer;
  private meteringEnabled: boolean = false;

  /**
   * Set listerner from native module for recorder.
   * @returns {callBack((e: RecordBackType): void)}
   */
  constructor(ctx: TurboModuleContext) {
    super(ctx);
    this.AVRecorderInstance = new Recorder(ctx.uiAbilityContext);
    this.AVPlayerInstance = new AudioPlayer(ctx.uiAbilityContext);
    this.ctx = ctx;
  }

  addListener(eventName: string): void {
    if (eventName === RecordBackName && !this.isRecording()) {
      this.addRecordBackListener();
    }
    if (eventName === playBackName) {
      this.addPlayBackListener();
    }
  }

  removeListeners(count: number): void {
  }

  /**
   * Remove listener for recorder.
   * @returns {void}
   */
  public addRecordBackListener(): void {
    if (this.RecordBackListenerTimer) {
      this.removeRecordBackListener();
    }
    this.AVRecorderInstance.onEvent(() => {
      this.RecordBackListenerTimer = setInterval(async () => {
        if (this.meteringEnabled) {
          let maxAmplitude: number = 0;
          let mediaRecorder: Recorder = this.AVRecorderInstance;
          if (mediaRecorder != null) {
            maxAmplitude = await mediaRecorder.getMaxAmplitude();
          }
          let dB: number = -160.0;
          let maxAudioSize: number = 32767.0;
          if (maxAmplitude > 0) {
            dB = 20 * Math.log10(maxAmplitude / maxAudioSize);
            dB = Math.floor(dB);
          }
          this.ctx.rnInstance.emitDeviceEvent(RecordBackName, {
            isRecording: this.AVRecorderInstance.isRecording,
            currentPosition: this.AVRecorderInstance.milliseconds,
            currentMetering: dB,
          });
        } else {
          this.ctx.rnInstance.emitDeviceEvent(RecordBackName, {
            isRecording: this.AVRecorderInstance.isRecording,
            currentPosition: this.AVRecorderInstance.milliseconds,
          });
        }
      }, this.subscriptionDuration);
    });
  }

  /**
   * Set listener from native module for player.
   * @returns {callBack((e: PlayBackType): void)}
   */
  public removeRecordBackListener(): void {
    clearInterval(this.RecordBackListenerTimer);
    this.RecordBackListenerTimer = null;
  }

  /**
   * remove listener for player.
   * @returns {void}
   */
  public addPlayBackListener(): void {
    if (this.PlayBackListenerTimer) {
      this.removePlayBackListener();
    }

    this.AVPlayerInstance.onEvent(EventTarget.timeUpdate, () => {
      this.PlayBackListenerTimer = setInterval(() => {
        this.ctx.rnInstance.emitDeviceEvent(playBackName, {
          isMuted: this.AVPlayerInstance.isMuted,
          isFinished: this.AVPlayerInstance.isFinished,
          currentPosition: this.AVPlayerInstance.currentPosition,
          duration: this.AVPlayerInstance.durationTime,
        });
        if (this.AVPlayerInstance.isFinished) {
          this.stopPlayer();
        }
      }, this.subscriptionDuration);
    });
  }

  public removePlayBackListener(): void {
    clearInterval(this.PlayBackListenerTimer);
    this.PlayBackListenerTimer = null;
  }

  /**
   * start recording with param.
   * @param {string} uri audio uri.
   * @returns {Promise<string>}
   */
  public async startRecorder(
    uri?: string,
    audioSets?: AudioSet,
    meteringEnabled?: boolean,
  ): Promise<string> {
    if (this.isRecording()) {
      return Promise.reject(processValue.play);
    }
    this.meteringEnabled = meteringEnabled === true ? true : false;
    const profile: media.AVRecorderProfile = this.getAudioSets(audioSets);
    this.AVRecorderInstance.setAVProfile(profile, audioSets?.AudioSourceHarmony as number as media.AudioSourceType);
    return this.AVRecorderInstance.startRecordingProcess(uri);
  }

  getAudioSets(audioSets?: AudioSet): media.AVRecorderProfile {
    let audioCodec: media.CodecMimeType = media.CodecMimeType.AUDIO_AAC;
    if (audioSets?.AudioMimeHarmony) {
      audioCodec = audioSets.AudioMimeHarmony as string as media.CodecMimeType;
    }
    const avProfile: media.AVRecorderProfile = {
      audioBitrate:
      audioSets?.AudioSamplingRateHarmony ||
        defaultBitrate, // 音频比特率
      audioChannels:
      audioSets?.AudioChannelsHarmony ||
        defaultChannels, // 音频声道数
      audioCodec: audioCodec, // 音频编码格式，当前只支持aac、vorbis、flac, 12开始支持AUDIO_MP3
      audioSampleRate:
      audioSets?.AudioSamplingRateHarmony ||
        defaultSampleRate, // 音频采样率
      fileFormat: (audioSets?.AudioFileFormatHarmony as string as media.ContainerFormatType) ||
      media.ContainerFormatType.CFT_MPEG_4A, // 封装格式，当前只支持m4a, 12开始支持CFT_MP3
    };
    return avProfile;
  }

  /**
   * Pause recording.
   * @returns {Promise<string>}
   */
  public async pauseRecorder(): Promise<string> {
    if (this.AVRecorderInstance.recorderState === AVRecorderState.started) {
      this.removeRecordBackListener();
      return this.AVRecorderInstance.pauseRecordingProcess();
    }
    return Promise.reject(processValue.stateError);
  }

  /**
   * Resume recording.
   * @returns {Promise<string>}
   */
  public async resumeRecorder(): Promise<string> {
    if (this.AVRecorderInstance.recorderState === AVRecorderState.paused) {
      this.addRecordBackListener();
      return this.AVRecorderInstance.resumeRecordingProcess();
    }
    return Promise.reject(processValue.stateError);
  }

  /**
   * stop recording.
   * @returns {Promise<string>}
   */
  public async stopRecorder(): Promise<string> {
    if (
    [AVRecorderState.started, AVRecorderState.paused].includes(
      this.AVRecorderInstance.recorderState,
    )
    ) {
      // 仅在started或者paused状态下调用stop为合理状态切换
      this.removeRecordBackListener();
      return this.AVRecorderInstance.stopRecordingProcess();
    }
    return Promise.reject(processValue.stateError);
  }

  public async startPlayer(uri?: string, httpHeaders?: Record<string, string>): Promise<string> {
    if (this.AVPlayerInstance.PlayerState === AVPlayerState.paused) {
      return this.resumePlayer();
    }
    const url = await this.AVPlayerInstance.startPlayeringProcess(uri, httpHeaders);
    !!url && this.addPlayBackListener();
    return url;
  }

  /**
   * Start playing with param.
   * @param {string} uri audio uri.
   * @returns {Promise<string>}
   */
  public async resumePlayer(): Promise<string> {
    if (this.AVPlayerInstance.PlayerState === AVPlayerState.paused) {
      this.addPlayBackListener();
      return this.AVPlayerInstance.resumePlayeringProcess();
    }
    return Promise.reject(processValue.stateError);
  }

  /**
   * Resume playing.
   * @returns {Promise<string>}
   */
  public async stopPlayer(): Promise<string> {
    this.removePlayBackListener();
    return this.AVPlayerInstance.stopPlayeringProcess();
  }

  /**
   * Stop playing.
   * @returns {Promise<string>}
   */
  public async pausePlayer(): Promise<string> {
    if (this.AVPlayerInstance.PlayerState === AVPlayerState.playing) {
      this.removePlayBackListener();
      return this.AVPlayerInstance.pausePlayeringProcess();
    }
    return Promise.reject(processValue.stateError);
  }

  /**
   * Pause playing.
   * @returns {Promise<string>}
   */
  public async seekToPlayer(time: number): Promise<string> {
    if (!this.AVPlayerInstance.seekToPlayer) {
      return Promise.reject(processValue.stateError);
    }
    return this.AVPlayerInstance.seekToPlayer(time);
  }

  /**
   * Seek to.
   * @param {number} time position seek to in millisecond.
   * @returns {Promise<string>}
   */
  async setVolume(volume: number): Promise<string> {
    if (!this.AVPlayerInstance.setVolume) {
      return Promise.reject(processValue.stateError);
    }
    return this.AVPlayerInstance.setVolume(volume);
  }

  /**
   * Set volume.
   * @param {number} setVolume set volume.
   * @returns {Promise<string>}
   */
  async setSubscriptionDuration(sec: number): Promise<string> {
    const milliseconds = sec * 1000;
    this.subscriptionDuration = milliseconds;
    return sec.toString();
  }

  private isRecording(): boolean {
    return [AVRecorderState.started, AVRecorderState.paused].includes(
      this.AVRecorderInstance.recorderState,
    );
  }
}
