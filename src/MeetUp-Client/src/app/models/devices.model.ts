export interface DevicesModel {
  activeAudioInput?: string,
  activeVideoInput?: string,
  activeAudioOutput?: string,
  audioInputs: MediaDeviceInfo[],
  audioOutputs: MediaDeviceInfo[],
  videoInputs: MediaDeviceInfo[],
}
