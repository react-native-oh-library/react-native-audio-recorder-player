/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
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

#include "RNAudioRecorderPlayerTurboModule.h"
#include "RNOH/ArkTSTurboModule.h"

using namespace rnoh;
using namespace facebook;
static jsi::Value __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_addRecordBackListener(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "addRecordBackListener", args, count);
}
static jsi::Value __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_removeRecordBackListener(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "removeRecordBackListener", args, count);
}

static jsi::Value __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_addPlayBackListener(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "addPlayBackListener", args, count);
}

static jsi::Value __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_removePlayBackListener(jsi::Runtime &rt, react::TurboModule &turboModule, const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).call(rt, "removePlayBackListener", args, count);
}

static jsi::Value _hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_addListener(
    jsi::Runtime &rt,
    react::TurboModule & turboModule,
    const jsi::Value* args,
    size_t count)
    {
        return jsi::Value(static_cast<ArkTSTurboModule &> (turboModule).call(rt,"addListener", args, count));
    }

static jsi::Value _hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_removeListeners(
    jsi::Runtime &rt,
    react::TurboModule & turboModule,
    const jsi::Value* args,
    size_t count)
    {
        return jsi::Value(static_cast<ArkTSTurboModule &> (turboModule).call(rt,"removeListeners", args, count));
    }

RNAudioRecorderPlayerTurboModuleSpecJSI::RNAudioRecorderPlayerTurboModuleSpecJSI(const ArkTSTurboModule::Context ctx, const std::string name)
    : ArkTSTurboModule(ctx, name) {
     methodMap_ = {
        ARK_ASYNC_METHOD_METADATA(startRecorder, 2),
        ARK_ASYNC_METHOD_METADATA(pauseRecorder,0 ),
        ARK_ASYNC_METHOD_METADATA(resumeRecorder, 0),
        ARK_ASYNC_METHOD_METADATA(stopRecorder, 0),
        ARK_ASYNC_METHOD_METADATA(resumePlayer, 0),
        ARK_ASYNC_METHOD_METADATA(startPlayer, 1),
        ARK_ASYNC_METHOD_METADATA(stopPlayer,0 ),
        ARK_ASYNC_METHOD_METADATA(pausePlayer, 0),
        ARK_ASYNC_METHOD_METADATA(seekToPlayer, 1),
        ARK_ASYNC_METHOD_METADATA(setVolume, 1),
        ARK_ASYNC_METHOD_METADATA(setSubscriptionDuration, 1),
    };
    methodMap_["addRecordBackListener"] = MethodMetadata{1, __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_addRecordBackListener};
    methodMap_["removeRecordBackListener"] = MethodMetadata{0, __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_removeRecordBackListener};
    methodMap_["addPlayBackListener"] = MethodMetadata{1, __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_addPlayBackListener};
    methodMap_["removePlayBackListener"] = MethodMetadata{0, __hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_removePlayBackListener};
    methodMap_["addListener"]= MethodMetadata{1, _hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_addListener};
    methodMap_["removeListeners"]= MethodMetadata{1, _hostFunction_RNAudioRecorderPlayerTurboModuleSpecJSI_removeListeners};
   
}