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
  VIDEO_H263 = 'video/h263', // 表示视频/h263类型。
  VIDEO_AVC = 'video/avc', // 表示视频/avc类型。
  VIDEO_MPEG2 = 'video/mpeg2', // 	表示视频/mpeg2类型。
  VIDEO_MPEG4 = 'video/mp4v-es', // 	表示视频/mpeg4类型。
  VIDEO_VP8 = 'video/x-vnd.on2.vp8', // 	表示视频/vp8类型。
  VIDEO_HEVC = 'video/hevc', // 	表示视频/H265类型。
  AUDIO_AAC = 'audio/mp4a-latm', // 表示音频/mp4a-latm类型。

  AUDIO_VORBIS = 'audio/vorbis', // 	表示音频/vorbis类型。
  AUDIO_FLAC = 'audio/flac', // 	表示音频/flac类型。
  AUDIO_MP3 = 'audio/mpeg', // 	表示音频/mpeg类型。
  AUDIO_G711MU = 'audio/g711mu', // 	表示音频/G711-mulaw类型。
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
  AudioEncodingBitRateHarmony?: number;
  AudioSamplingRateHarmony?: number;
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

export enum harmonyEventName {
  recordBack = 'rn-recordback',
  playBack = 'rn-playback'
}