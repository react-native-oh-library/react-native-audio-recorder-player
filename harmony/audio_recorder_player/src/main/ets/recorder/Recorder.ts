import media from '@ohos.multimedia.media';
import Logger from '../utils/Logger';
import SaveAudioAsset from '../utils/SaveAudioAsset';
import { BusinessError } from '@kit.BasicServicesKit';
import abilityAccessCtrl, { Permissions } from '@ohos.abilityAccessCtrl';
import { common } from '@kit.AbilityKit';
import { avConfig, avProfile, AVRecorderState, defaultTimeOut, fdPath, PERMISSIONS, processValue, TAG, } from './types';

export default class Recorder {
  public isRecording: boolean = false;
  public milliseconds: number = 0;
  public recorderState: AVRecorderState;
  private audioRecorder: media.AVRecorder;
  private fdPath: string;
  private timer;
  private mSaveAudioAsset: SaveAudioAsset = new SaveAudioAsset(TAG);
  private permissions: Array<Permissions> = [
    PERMISSIONS.MICROPHONE,
    PERMISSIONS.READ_MEDIA,
    PERMISSIONS.WRITE_MEDIA,
  ];
  private atManager: abilityAccessCtrl.AtManager =
    abilityAccessCtrl.createAtManager();
  private mFileAssetId: number;
  private avProfile: media.AVRecorderProfile;
  private avConfig: media.AVRecorderConfig;
  private startRecordCallback: () => void;

  public setAVProfile(newValue: media.AVRecorderProfile) {
    this.avProfile = {
      ...avProfile,
      ...newValue,
    };
    this.avConfig = {
      ...avConfig,
      profile: this.avProfile,
    };
  }

  public onEvent(callback: () => void) {
    this.startRecordCallback = callback;
  }

  // start button process
  async startRecordingProcess(url?: string): Promise<string> {
    Logger.info(TAG, 'startRecording called', this.recorderState);
    if (this.isRecording) {
      Logger.info(TAG, 'audioRecorder exist,release it');
      return processValue.stateError;
    }
    const isPermissions: boolean = await this.requestPermissions();
    if (isPermissions) {
      await this.getFileFd(url);
      await this.createAudioRecorder();
      await this.prepareAudioRecorder();
      Logger.info(TAG, 'startRecording done');
      return this.mSaveAudioAsset.getFilePath();
    }
    return processValue.NoPermissions;
  }

  // pause button process
  async pauseRecordingProcess(): Promise<string | undefined> {
    Logger.info(TAG, 'pauseRecording called');
    if (this.recorderState === AVRecorderState.started) {
      Logger.info(TAG, 'current state is started, to pause');
      return this.audioRecorder.pause().then(() => processValue.pause);
    }
    Logger.info(TAG, 'pauseRecording done');
    return processValue.stateError;
  }

  // resume button process
  async resumeRecordingProcess(): Promise<string | undefined> {
    Logger.info(TAG, 'resumeRecording called');
    if (this.recorderState === AVRecorderState.paused) {
      Logger.info(TAG, 'current state is paused, to resume');
      this.isRecording = true;
      return this.audioRecorder.resume().then(() => processValue.resume);
    }
    Logger.info(TAG, 'resumeRecording done');
    return processValue.stateError;
  }

  // stop button process
  async stopRecordingProcess(): Promise<string | undefined> {
    Logger.info(TAG, 'stopRecording called');
    clearInterval(this.timer);
    this.isRecording = false;
    this.milliseconds = 0;
    await this.audioRecorder.stop();
    Logger.info(TAG, 'stopRecording stop');
    await this.closeFd();
    Logger.info(TAG, 'stopRecording closeFd');
    await this.resetAudioRecording();
    Logger.info(TAG, 'stopRecording reset');
    await this.releaseAudioRecorder();
    Logger.info(TAG, 'stopRecording release');
    return this.getFilePath();
  }

  private async catchCallback(error: BusinessError): Promise<void> {
    Logger.info(
      TAG,
      `catchCallback code:${error.code} message：${error.message}`,
    );
  }

  private async requestPermissions(): Promise<boolean> {
    return await new Promise((resolve: Function) => {
      try {
        const context = getContext() as common.UIAbilityContext;
        this.atManager
          .requestPermissionsFromUser(context, this.permissions)
          .then(async () => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      } catch (err) {
        resolve(false);
      }
    });
  }

  // show recording time
  private getRecordTime(): void {
    this.timer = setInterval(() => {
      this.milliseconds += defaultTimeOut;
    }, defaultTimeOut);
  }

  // create file fd
  private async getFileFd(url?: string): Promise<void> {
    Logger.info(TAG, 'getFileFd called');
    return new Promise(async (resolve, reject) => {
      if (url && url.startsWith(fdPath)) {
        this.avConfig.url = url;
        Logger.info(TAG, 'url is :', url);
        resolve();
        return;
      }
      this.mFileAssetId = await this.mSaveAudioAsset.createAudioFd();
      if (!this.mFileAssetId) {
        reject();
        return;
      }
      this.fdPath = fdPath + this.mFileAssetId.toString();
      this.avConfig.url = this.fdPath;
      Logger.info(TAG, 'fdPath is: ' + this.fdPath);
      Logger.info(TAG, 'getFileFd done');
      resolve();
    });
  }

  private async createAudioRecorder(): Promise<void> {
    await media
      .createAVRecorder()
      .then((recorder) => {
        Logger.info(TAG, 'case createAVRecorder called');
        if (!!recorder) {
          this.audioRecorder = recorder;
          this.setCallback();
        } else {
          Logger.info(TAG, 'case create avRecorder failed!!!');
        }
      })
      .catch(this.catchCallback);
  }

  // set callback on
  private setCallback(): void {
    Logger.info(TAG, 'case callback');
    this.audioRecorder!.on(
      AVRecorderState.onStateChange,
      (state: media.AVRecorderState) => {
        Logger.info(TAG, 'case state has changed, new state is' + state);
        switch (state) {
          case AVRecorderState.idle: {
            this.recorderState = AVRecorderState.idle;
            break;
          }
          case AVRecorderState.prepared: {
            this.recorderState = AVRecorderState.prepared;
            break;
          }
          case AVRecorderState.started: {
            this.recorderState = AVRecorderState.started;
            this.startRecordCallback();
            this.getRecordTime();
            this.isRecording = true;
            break;
          }
          case AVRecorderState.paused: {
            this.recorderState = AVRecorderState.paused;
            this.isRecording = false;
            clearInterval(this.timer);
            break;
          }
          case AVRecorderState.stopped: {
            this.recorderState = AVRecorderState.stopped;
            this.isRecording = false;
            break;
          }
          case AVRecorderState.released: {
            this.recorderState = AVRecorderState.released;
            this.isRecording = false;
            break;
          }
          default:
            Logger.info(TAG, 'case start is unknown');
            break;
        }
      },
    );
    this.audioRecorder!.on(AVRecorderState.error, (err) => {
      this.stopRecordingProcess();
      Logger.info(
        TAG,
        'case avRecorder.on(error) called, errMessage is ' + err.message,
      );
    });
  }

  private async prepareAudioRecorder(): Promise<void> {
    Logger.info(TAG, 'case prepareAudioRecorder in');
    await this.audioRecorder!.prepare(this.avConfig)
      .then(() => {
        this.audioRecorder!.start();
        Logger.info(TAG, 'case prepare AVRecorder called');
      }, this.catchCallback)
      .catch(this.catchCallback);
    Logger.info(TAG, 'case prepareAudioRecorder out');
  }

  private async resetAudioRecording(): Promise<void> {
    await this.audioRecorder!.reset()
      .then(() => {
        Logger.info(TAG, 'case resetAudioRecording called');
      }, this.catchCallback)
      .catch(this.catchCallback);
  }

  private async releaseAudioRecorder(): Promise<void> {
    if (this.audioRecorder) {
      await this.audioRecorder.off(AVRecorderState.onStateChange);
      await this.audioRecorder.off(AVRecorderState.error);
      this.audioRecorder
        .release()
        .then(() => {
          this.audioRecorder = undefined;
          Logger.info(TAG, 'case releaseAudioRecorder called');
        }, this.catchCallback)
        .catch(this.catchCallback);
    }
  }

  // close file fd
  private async closeFd(): Promise<void> {
    Logger.info(TAG, 'case closeFd called');
    if (this.fdPath) {
      this.mSaveAudioAsset.closeFile();
      this.mFileAssetId = -1;
      this.fdPath = '';
      Logger.info(TAG, 'case closeFd done');
    }
  }

  private getFilePath(): string {
    const context = getContext() as common.UIAbilityContext;
    return `${context.filesDir}/${this.mSaveAudioAsset.getFileName()}`;
  }
}
