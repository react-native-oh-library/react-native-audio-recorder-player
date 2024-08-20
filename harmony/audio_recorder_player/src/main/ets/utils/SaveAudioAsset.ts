/*
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DateTimeUtil from './DateTimeUtils';
import Logger from './Logger';
import fs from '@ohos.file.fs';
import { common } from '@kit.AbilityKit';
import audio from '@ohos.multimedia.audio';

export default class SaveCameraAsset {
  public file: fs.File;
  private tag: string;
  private lastSaveTime: string = '';
  private saveIndex: number = 0;
  private audioManager: audio.AudioManager = audio.getAudioManager();
  private audioVolumeManager: audio.AudioVolumeManager =
    this.audioManager.getVolumeManager();
  private audioVolumeGroupManager =
    this.audioVolumeManager.getVolumeGroupManagerSync(
      audio.DEFAULT_VOLUME_GROUP_ID,
    );
  private fileName: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  public async createAudioFd(): Promise<number> {
    Logger.info(this.tag, 'get Recorder File Fd');
    const mDateTimeUtil = new DateTimeUtil();
    const displayName = this.checkName(
      `REC_${mDateTimeUtil.getDate()}_${mDateTimeUtil.getTime()}.m4a`,
    );
    const context = getContext() as common.UIAbilityContext;
    const path = `${context.filesDir}/${displayName}`;
    this.fileName = displayName;
    this.file = this.createOrOpen(path);
    return this.file?.fd ?? 0;
  }

  public getFilePath() {
    return this.file.path;
  }

  public getFileName() {
    return this.fileName;
  }

  public mediaIsMute(): boolean {
    return this.audioVolumeGroupManager.isMuteSync(audio.AudioVolumeType.MEDIA);
  }

  public closeFile() {
    fs.closeSync(this.file);
  }

  private createOrOpen(path: string): fs.File {
    const isExist = fs.accessSync(path);
    let file: fs.File;
    if (isExist) {
      file = fs.openSync(path, fs.OpenMode.READ_WRITE);
    } else {
      file = fs.openSync(path, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
    }
    return file;
  }

  private checkName(name: string): string {
    if (this.lastSaveTime == name) {
      this.saveIndex += 1;
      return `${name}_${this.saveIndex}`;
    }
    this.lastSaveTime = name;
    this.saveIndex = 0;
    Logger.info(this.tag, 'get Recorder File name is: ' + name);
    return name;
  }
}
