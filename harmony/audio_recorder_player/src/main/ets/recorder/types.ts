/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import media from '@ohos.multimedia.media';

export const defaultBitrate: number = 48000;

export const defaultSampleRate: number = 48000;

export const defaultChannels: number = 2;

export const defaultTimeOut: number = 200;

export const TAG: string = 'Audio_Recorder';

export const RecordBackName: string = 'rn-recordback';

export const fdPath: string = 'fd://';

export enum PERMISSIONS {
  MICROPHONE = 'ohos.permission.MICROPHONE',
  WRITE_MEDIA = 'ohos.permission.WRITE_MEDIA',
  READ_MEDIA = 'ohos.permission.READ_MEDIA',
}

export const avProfile: media.AVRecorderProfile = {
  audioBitrate: defaultBitrate, // set audioBitrate according to device ability
  audioChannels: defaultChannels, // set audioChannels, valid value 1-8
  audioCodec: media.CodecMimeType.AUDIO_AAC, // set audioCodec, AUDIO_AAC is the only choice
  audioSampleRate: defaultSampleRate, // set audioSampleRate according to device ability
  fileFormat: media.ContainerFormatType.CFT_MPEG_4A, // set fileFormat, for video is m4a
};

export const avConfig: media.AVRecorderConfig = {
  audioSourceType: media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC,
  profile: avProfile,
  url: fdPath,
};

export enum AVRecorderState {
  idle = 'idle',
  prepared = 'prepared',
  started = 'started',
  paused = 'paused',
  stopped = 'stopped',
  released = 'released',
  error = 'error',
  onStateChange = 'stateChange',
}

export enum processValue {
  start = 'Already recording.',
  pause = 'Already paused recording.',
  resume = 'Currently recording.',
  stop = 'Already stopped',
  NoPermissions = 'No permissions of recorder',
  stateError = 'current state is not allowed',
}
