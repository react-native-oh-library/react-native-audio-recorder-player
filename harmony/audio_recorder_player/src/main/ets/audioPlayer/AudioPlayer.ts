import media from '@ohos.multimedia.media';
import SaveAudioAsset from '../utils/SaveAudioAsset';
import Logger from '../utils/Logger';
import { BusinessError } from '@kit.BasicServicesKit';
import fs from '@ohos.file.fs';
import { common } from '@kit.AbilityKit';
import { AVPlayerState, EventTarget, pathStartWith, processValue, TAG, } from './types';
import { fdPath } from '../recorder/types';

export default class Player {
  public isPlaying: boolean = false;
  public currentPosition: number = 0;
  public isMuted: boolean = false;
  public isFinished: boolean = false;
  public durationTime: number = 0;
  public PlayerState: AVPlayerState;
  private audioPlayer: media.AVPlayer;
  private audioPlayer: media.AVPlayer;
  private AudioAsset = new SaveAudioAsset(TAG);
  private playUrl: string;
  private EventMap: Map<string, any> = new Map();

  public onEvent(name: string, callback: () => void) {
    if (this.EventMap.has(name)) {
      return;
    }
    this.EventMap.set(name, callback);
  }

  public async setVolume(volume: number): Promise<string> {
    if (this.isHandleState()) {
      return this.setPlayerVolume(volume);
    }
    return new Promise((resolve, reject) => {
      this.onEvent(EventTarget.setVolume, async () => {
        try {
          const volumes = await this.setPlayerVolume(volume);
          volumes && resolve(volumes);
        } catch (e) {
          reject(processValue.stateError);
        }
      });
    });
  }

  public seekToPlayer(time: number): Promise<string> {
    if (this.isHandleState()) {
      return this.seekToPlayerTime(time);
    }
    return new Promise((resolve, reject) => {
      this.onEvent(EventTarget.seekToPlayer, async () => {
        try {
          const times = await this.seekToPlayerTime(time);
          times && resolve(times);
        } catch (e) {
          reject(processValue.stateError);
        }
      });
    });
  }

  public seekToPlayerTime(time: number): Promise<string> {
    return new Promise((resolve) => {
      this.audioPlayer.seek(time);
      this.audioPlayer.on(EventTarget.seekDone, (seekDoneTime: number) => {
        resolve(seekDoneTime.toString());
        this.audioPlayer.off(EventTarget.seekDone);
      });
    });
  }

  isHandleState() {
    return [
      AVPlayerState.playing,
      AVPlayerState.prepared,
      AVPlayerState.paused,
      AVPlayerState.completed,
    ].includes(this.audioPlayer.state as AVPlayerState);
  }

  // start button process
  async startPlayeringProcess(url?: string): Promise<string> {
    Logger.info(TAG, 'startPlayering called');
    if (this.isPlaying || this.PlayerState === AVPlayerState.paused) {
      return;
    }
    await this.createAudioPlayer();
    await this.setAudioPlayerUrl(url);
    Logger.info(TAG, 'startPlayering done');
    return this.playUrl;
  }

  // pause button process
  async pausePlayeringProcess(): Promise<string> {
    Logger.info(TAG, 'pausePlayering called');
    if (this.PlayerState === AVPlayerState.playing) {
      Logger.info(TAG, 'current state is playing, to pause');
      return this.handelPlayerFunc(
        this.audioPlayer.pause(),
        processValue.pause,
      );
    }
    Logger.info(TAG, 'pausePlayering done');
    return processValue.stateError;
  }

  async resumePlayeringProcess(): Promise<string> {
    Logger.info(TAG, ' resumePlayering called');
    if (this.PlayerState === AVPlayerState.paused) {
      Logger.info(TAG, 'current state is paused, to  resume');
      this.seekToPlayerTime(this.currentPosition).then(() => {
        this.getCurrentPosition();
        this.audioPlayer.play();
        return processValue.resume;
      });
    }
    Logger.info(TAG, ' resumePlayering done');
    return processValue.stateError;
  }

  // stop button process
  async stopPlayeringProcess(): Promise<string> {
    Logger.info(TAG, 'stopPlayering called');
    if (!this.isHandleState()) {
      return processValue.stateError;
    }
    this.isPlaying = false;
    this.currentPosition = 0;
    this.durationTime = 0;
    await this.resetAudioPlayering();
    await this.stopAudioPlayering();
    await this.releaseAudioPlayer();
    Logger.info(TAG, 'stopPlayering done');
    return this.playUrl;
  }

  private async failureCallback(error: BusinessError): Promise<void> {
    Logger.info(
      TAG,
      `failureCallback code:${error.code} message：${error.message}`,
    );
  }

  private async catchCallback(error: BusinessError): Promise<void> {
    Logger.info(
      TAG,
      `catchCallback code:${error.code} message：${error.message}`,
    );
  }

  private getDurationTime() {
    this.audioPlayer.on(EventTarget.durationUpdate, (duration: number) => {
      Logger.info(TAG, 'durationUpdate called,new duration is :' + duration);
      this.durationTime = duration;
    });
  }

  private getCurrentPosition() {
    this.audioPlayer.on(EventTarget.timeUpdate, (time: number) => {
      Logger.info(TAG, 'timeUpdate called,and new time is :' + time);
      this.currentPosition = time;
      this.isFinished = this.currentPosition === this.durationTime;
    });
  }

  private async setPlayerVolume(volume: number): Promise<string> {
    if (volume < 0 || volume > 1) {
      throw new Error('Value of volume should be between 0.0 to 1.0');
    }
    return new Promise((resolve) => {
      this.audioPlayer.setVolume(volume);
      this.audioPlayer.on(EventTarget.volumeChange, (vol: number) => {
        resolve(vol.toFixed(1));
        this.audioPlayer.off(EventTarget.volumeChange);
      });
    });
  }

  private async createAudioPlayer(): Promise<void> {
    if (this.audioPlayer) {
      this.stopPlayeringProcess();
    }
    await media
      .createAVPlayer()
      .then((player) => {
        Logger.info(TAG, 'case createAVPlayer called');
        if (!!Player) {
          this.audioPlayer = player;
        } else {
          Logger.info(TAG, 'case create avPlayer failed!!!');
          return;
        }
      }, this.failureCallback)
      .catch(this.catchCallback);
    this.setCallback();
  }

  // set callback on
  private setCallback(): void {
    Logger.info(TAG, 'case callback');
    this.audioPlayer!.on(EventTarget.stateChange, async (state, reason) => {
      Logger.info(
        TAG,
        'case state has changed, new state is  ' + state + 'reason: ' + reason,
      );
      this.isMuted = this.AudioAsset.mediaIsMute();
      if (this.isHandleState()) {
        for (const [key, value] of this.EventMap) {
          if (key === EventTarget.timeUpdate) {
            continue;
          }
          await value();
          this.EventMap.delete(key);
        }
      }
      switch (state) {
        case AVPlayerState.idle: {
          this.PlayerState = AVPlayerState.idle;
          break;
        }
        case AVPlayerState.initialized: {
          this.getDurationTime();
          this.prepareAudioPlayer();
          this.getCurrentPosition();
        }
        case AVPlayerState.prepared: {
          this.PlayerState = AVPlayerState.prepared;
          this.isPlaying = false;
          break;
        }
        case AVPlayerState.playing: {
          this.PlayerState = AVPlayerState.playing;
          this.isPlaying = true;
          const callbackTimeChange = this.EventMap.get(EventTarget.timeUpdate);
          callbackTimeChange && callbackTimeChange();
          this.EventMap.delete(EventTarget.timeUpdate);
          this.audioPlayer.off(EventTarget.durationUpdate);
          break;
        }
        case AVPlayerState.paused: {
          this.PlayerState = AVPlayerState.paused;
          this.audioPlayer.off(EventTarget.timeUpdate);
          this.isPlaying = false;
          break;
        }
        case AVPlayerState.completed: {
          this.isPlaying = false;
          this.audioPlayer.off(EventTarget.timeUpdate);
          // /
        }
        case AVPlayerState.stopped: {
          this.PlayerState = AVPlayerState.stopped;
          this.isPlaying = false;
          break;
        }
        case AVPlayerState.released: {
          this.PlayerState = AVPlayerState.released;
          break;
        }
        default:
          Logger.info(TAG, 'case start is unknown');
          break;
      }
    });
    this.audioPlayer!.on(EventTarget.error, async (err) => {
      this.audioPlayer.reset();
      this.stopPlayeringProcess();
      Logger.info(
        TAG,
        'case avPlayer.on(error) called, errMessage is ' + err.message,
      );
    });
  }

  private async setAudioPlayerUrl(url?: string) {
    Logger.info(TAG, 'url is ', url);
    if (pathStartWith.some((item) => url.startsWith(item))) {
      this.audioPlayer.url = url;
      this.playUrl = url;
      return;
    }
    const lastUrl = this.getFileList();
    if (lastUrl) {
      this.audioPlayer.url = fdPath + lastUrl;
      return;
    }
    Logger.error(TAG, 'this uri is  not allowed');
    return Promise.reject('this uri is  not allowed');
  }

  private handelPlayerFunc(func: Promise<void>, msg: string): Promise<string> {
    return new Promise((resolve, reject) => {
      func
        .then(() => {
          resolve(msg);
        }, reject)
        .catch(reject);
    });
  }

  private getFileList(): number {
    const context = getContext() as common.UIAbilityContext;
    const path = context.filesDir;
    const fileList: string[] = fs.listFileSync(path) ?? [];
    const audioList = fileList.filter((item: string) =>
    item.endsWith(media.ContainerFormatType.CFT_MPEG_4A),
    );
    const last = audioList.pop();
    Logger.info(TAG, last);
    if (last) {
      this.playUrl = `${path}/${last}`;
      const file = fs.openSync(this.playUrl);
      Logger.info(TAG, 'last file path ', last);
      return file.fd;
    }
  }

  private async prepareAudioPlayer(): Promise<void> {
    Logger.info(TAG, 'case prepareAudioPlayer in');
    await this.audioPlayer!.prepare()
      .then(() => {
        Logger.info(TAG, 'case prepare AVPlayer called');
        this.startAudioPlayering();
      }, this.failureCallback)
      .catch(this.catchCallback);
    Logger.info(TAG, 'case prepareAudioPlayer out');
  }

  private async startAudioPlayering(): Promise<void> {
    Logger.info(TAG, 'case startAudioPlayering called');
    await this.audioPlayer!.play()
      .then(() => {
        Logger.info(TAG, 'case start AudioPlayer called');
      }, this.failureCallback)
      .catch(this.catchCallback);
  }

  private async stopAudioPlayering(): Promise<void> {
    Logger.info(TAG, 'case stopAudioPlayering called');
    await this.audioPlayer!.stop()
      .then(() => {
        Logger.info(TAG, 'case stop AudioPlayer called');
      }, this.failureCallback)
      .catch(this.catchCallback);
  }

  private async resetAudioPlayering(): Promise<void> {
    await this.audioPlayer!.reset()
      .then(() => {
        Logger.info(TAG, 'case resetAudioPlayering called');
      }, this.failureCallback)
      .catch(this.catchCallback);
  }

  private async releaseAudioPlayer(): Promise<void> {
    if (this.audioPlayer) {
      this.audioPlayer.off(EventTarget.stateChange);
      this.audioPlayer.off(EventTarget.error);
      this.audioPlayer.off(EventTarget.timeUpdate);
      await this.audioPlayer
        .release()
        .then(() => {
          Logger.info(TAG, 'case releaseAudioPlayer called');
        }, this.failureCallback)
        .catch(this.catchCallback);
      this.audioPlayer = undefined;
    }
  }
}
