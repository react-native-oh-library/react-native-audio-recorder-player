import media from '@ohos.multimedia.media';
import { BusinessError } from '@kit.BasicServicesKit';
import abilityAccessCtrl, { Permissions } from '@ohos.abilityAccessCtrl';
import { common } from '@kit.AbilityKit';
import { avConfig, avProfile, AVRecorderState, defaultTimeOut, fdPath, PERMISSIONS, processValue, TAG, } from './types';
import Logger from '../utils/Logger';
import SaveAudioAsset from '../utils/SaveAudioAsset';

export default class Recorder {
  public isRecording: boolean = false;
  public milliseconds: number = 0;
  public recorderState: AVRecorderState;
  private audioRecorder: media.AVRecorder;
  private fdPath: string;
  private timer;
  private mSaveAudioAsset: SaveAudioAsset;
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
  private context: common.UIAbilityContext;

  constructor(context: common.UIAbilityContext) {
    this.context = context;
    this.mSaveAudioAsset = new SaveAudioAsset(TAG, context);
  }

  public setAVProfile(newValue: media.AVRecorderProfile, audioSource?: media.AudioSourceType) {
    this.avProfile = {
      ...avProfile,
      ...newValue,
    };
    if (audioSource) {
      avConfig.audioSourceType = audioSource;
    }
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
    Logger.debug(TAG, 'startRecording called', this.recorderState);
    if (this.isRecording) {
      Logger.debug(TAG, 'audioRecorder exist,release it');
      return processValue.stateError;
    }
    const isPermissions: boolean = await this.requestPermissions();
    if (isPermissions) {
      await this.getFileFd(url);
      await this.createAudioRecorder();
      await this.prepareAudioRecorder();
      Logger.debug(TAG, 'startRecording done');
      return this.mSaveAudioAsset.getFilePath();
    }
    return processValue.NoPermissions;
  }

  // pause button process
  async pauseRecordingProcess(): Promise<string | undefined> {
    Logger.debug(TAG, 'pauseRecording called');
    if (this.recorderState === AVRecorderState.started) {
      Logger.debug(TAG, 'current state is started, to pause');
      return this.audioRecorder.pause().then(() => processValue.pause);
    }
    Logger.debug(TAG, 'pauseRecording done');
    return processValue.stateError;
  }

  // resume button process
  async resumeRecordingProcess(): Promise<string | undefined> {
    Logger.debug(TAG, 'resumeRecording called');
    if (this.recorderState === AVRecorderState.paused) {
      Logger.debug(TAG, 'current state is paused, to resume');
      this.isRecording = true;
      return this.audioRecorder.resume().then(() => processValue.resume);
    }
    Logger.debug(TAG, 'resumeRecording done');
    return processValue.stateError;
  }

  // stop button process
  async stopRecordingProcess(): Promise<string | undefined> {
    Logger.debug(TAG, 'stopRecording called');
    clearInterval(this.timer);
    this.isRecording = false;
    this.milliseconds = 0;
    await this.audioRecorder.stop();
    Logger.debug(TAG, 'stopRecording stop');
    await this.closeFd();
    Logger.debug(TAG, 'stopRecording closeFd');
    await this.resetAudioRecording();
    Logger.debug(TAG, 'stopRecording reset');
    await this.releaseAudioRecorder();
    Logger.debug(TAG, 'stopRecording release');
    return this.getFilePath();
  }

  private async catchCallback(error: BusinessError): Promise<void> {
    Logger.debug(
      TAG,
      `catchCallback code:${error.code} message：${error.message}`,
    );
  }

  private async requestPermissions(): Promise<boolean> {
    return await new Promise((resolve: Function) => {
      try {
        const context = this.context as common.UIAbilityContext;
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
    Logger.debug(TAG, 'getFileFd called');
    return new Promise(async (resolve, reject) => {
      if (url && url.startsWith(fdPath)) {
        this.avConfig.url = url;
        Logger.debug(TAG, 'url is :', url);
        resolve();
        return;
      }
      this.mFileAssetId = await this.mSaveAudioAsset.createAudioFd(url,
        this.avConfig?.profile?.fileFormat || media.ContainerFormatType.CFT_MPEG_4A);
      if (!this.mFileAssetId) {
        reject();
        return;
      }
      this.fdPath = fdPath + this.mFileAssetId.toString();
      this.avConfig.url = this.fdPath;
      Logger.debug(TAG, 'fdPath is: ' + this.fdPath);
      Logger.debug(TAG, 'getFileFd done');
      resolve();
    });
  }

  private async createAudioRecorder(): Promise<void> {
    await media
      .createAVRecorder()
      .then((recorder) => {
        Logger.debug(TAG, 'case createAVRecorder called');
        if (!!recorder) {
          this.audioRecorder = recorder;
          this.setCallback();
        } else {
          Logger.debug(TAG, 'case create avRecorder failed!!!');
        }
      })
      .catch(this.catchCallback);
  }

  // set callback on
  private setCallback(): void {
    Logger.debug(TAG, 'case callback');
    this.audioRecorder!.on(
      AVRecorderState.onStateChange,
      (state: media.AVRecorderState) => {
        Logger.debug(TAG, 'case state has changed, new state is' + state);
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
            if (this.startRecordCallback) {
              this.startRecordCallback();
            }
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
            Logger.debug(TAG, 'case start is unknown');
            break;
        }
      },
    );
    this.audioRecorder!.on(AVRecorderState.error, (err) => {
      this.stopRecordingProcess();
      Logger.debug(
        TAG,
        'case avRecorder.on(error) called, errMessage is ' + err.code,
      );
    });
  }

  private async prepareAudioRecorder(): Promise<void> {
    Logger.debug(TAG, 'case prepareAudioRecorder in');
    await this.audioRecorder!.prepare(this.avConfig)
      .then(() => {
        this.audioRecorder!.start();
        Logger.debug(TAG, 'case prepare AVRecorder called');
      }, this.catchCallback)
      .catch(this.catchCallback);
    Logger.debug(TAG, 'case prepareAudioRecorder out');
  }

  private async resetAudioRecording(): Promise<void> {
    await this.audioRecorder!.reset()
      .then(() => {
        Logger.debug(TAG, 'case resetAudioRecording called');
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
          Logger.debug(TAG, 'case releaseAudioRecorder called');
        }, this.catchCallback)
        .catch(this.catchCallback);
    }
  }

  // close file fd
  private async closeFd(): Promise<void> {
    Logger.debug(TAG, 'case closeFd called');
    if (this.fdPath) {
      this.mSaveAudioAsset.closeFile();
      this.mFileAssetId = -1;
      this.fdPath = '';
      Logger.debug(TAG, 'case closeFd done');
    }
  }

  private getFilePath(): string {
    const context = this.context as common.UIAbilityContext;
    return `${context.filesDir}/${this.mSaveAudioAsset.getFileName()}`;
  }

  public getMaxAmplitude(): Promise<number> {
    if (!this.audioRecorder) {
      return new Promise((resolve) => resolve(0));
    }
    return this.audioRecorder.getAudioCapturerMaxAmplitude();
  }
}
