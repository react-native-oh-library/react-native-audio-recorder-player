/**
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

export type AVEncodingType =
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
  AudioSourceAndroid?: AudioSourceAndroidType;
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

