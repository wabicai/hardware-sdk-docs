# Error Code

This page lists the error codes exposed by hardware-js-sdk (core/shared). Use these codes to handle errors programmatically and show user‑friendly messages.

Notes
- Codes and messages mirror hardware-js-sdk (source): https://github.com/OneKeyHQ/hardware-js-sdk/blob/onekey/packages/shared/src/HardwareError.ts
- Grouped by domain for quick lookup.

## 0. Unknown
- **UnknownError (0):** Unknown error occurred. Check message property.

## 1. Device (101–118)
- **DeviceFwException (101):** Firmware version mismatch
- **DeviceUnexpectedMode (102):** Device unexpected mode
- **DeviceListNotInitialized (103):** Device list is not initialized
- **SelectDevice (104):** Please select the connected device
- **DeviceNotFound (105):** Device not found
- **DeviceInitializeFailed (106):** Device initialization failed
- **DeviceInterruptedFromOutside (107):** Device interrupted
- **RequiredButInBootloaderMode (108):** Device should be in bootloader mode
- **DeviceInterruptedFromUser (109):** Device interrupted
- **DeviceCheckDeviceIdError (110):** Device Id in the features is not same
- **DeviceNotSupportPassphrase (111):** Device not support passphrase
- **DeviceCheckPassphraseStateError (112):** Device passphrase state error
- **DeviceNotOpenedPassphrase (113):** Device not opened passphrase
- **DeviceOpenedPassphrase (114):** Device opened passphrase
- **DeviceDetectInBootloaderMode (115):** Device in bootloader mode
- **NotAllowInBootloaderMode (116):** Device not allow in bootloader mode
- **DeviceBusy (117):** Device is busy
- **DeviceCheckUnlockTypeError (118):** Device check unlock type not match error
- **NotInitialized (200):** Not initialized

## 2. IFrame (300–305)
- **IFrameNotInitialized (300):** IFrame not initialized
- **IFrameAleradyInitialized (301):** IFrame already initialized
- **IFrameLoadFail (302):** IFrame load fail
- **IframeTimeout (303):** Init iframe timeout
- **IframeBlocked (304):** IFrame blocked
- **IframeDistrust (305):** IFrame host not trusted

## 3. Method / Firmware (400–418)
- **CallMethodError (400):** Runtime errors during method execution
- **CallMethodNotResponse (404):** Method does not respond
- **CallMethodInvalidParameter (405):** Invalid parameter
- **FirmwareUpdateDownloadFailed (406):** Firmware update download failed
- **CallMethodNeedUpgradeFirmware (407):** Need firmware upgrade
- **CallMethodDeprecated (408):** Method is deprecated
- **FirmwareUpdateLimitOneDevice (409):** Only one device allowed during firmware update
- **FirmwareUpdateManuallyEnterBoot (410):** Manually enter bootloader required
- **FirmwareUpdateAutoEnterBootFailure (411):** Auto enter bootloader failed
- **NewFirmwareUnRelease (412):** New firmware not released yet
- **UseDesktopToUpdateFirmware (413):** Use OneKey Desktop to update firmware
- **NewFirmwareForceUpdate (414):** New firmware released, please update (mandatory)
- **DeviceNotSupportMethod (415):** Device not support this method
- **ForbiddenKeyPath (416):** Forbidden key path
- **RepeatUnlocking (417):** Repeat unlocking
- **DefectiveFirmware (418):** Device firmware is defective, update immediately

## 4. Network (500)
- **NetworkError (500):** Network request error

## 5. Transport (600–603)
- **TransportNotConfigured (600):** Transport not configured
- **TransportCallInProgress (601):** Transport call in progress
- **TransportNotFound (602):** Transport not found
- **TransportInvalidProtobuf (603):** Transport invalid protobuf

## 6. Bluetooth (700–722)
- **BleScanError (700):** Scan error
- **BlePermissionError (701):** Bluetooth permission required
- **BleLocationError (702):** Location permission error
- **BleRequiredUUID (703):** UUID required
- **BleConnectedError (704):** Connected error (runtime)
- **BleDeviceNotBonded (705):** Device not bonded
- **BleServiceNotFound (706):** Service not found
- **BleCharacteristicNotFound (707):** Characteristic not found
- **BleMonitorError (708):** Monitor error: characteristic not found
- **BleCharacteristicNotifyError (709):** Notify error
- **BleWriteCharacteristicError (710):** Write error
- **BleAlreadyConnected (711):** Already connected
- **BleLocationServicesDisabled (712):** Location services disabled
- **BleTimeoutError (713):** Connection timed out
- **BleForceCleanRunPromise (714):** Force clean Bluetooth run promise
- **BleDeviceBondError (715):** Bluetooth pairing failed
- **BleCharacteristicNotifyChangeFailure (716):** Notify change failure
- **BleTransportCallCanceled (717):** Transport call canceled
- **BleDeviceBondedCanceled (718):** Device bonding canceled
- **BlePeerRemovedPairingInformation (719):** Peer removed pairing information
- **BleDeviceDisconnected (720):** Device disconnected
- **BlePoweredOff (721):** Bluetooth powered off
- **BleUnsupported (722):** Bluetooth unsupported

## 7. Runtime / Bridge (800–821)
- **RuntimeError (800):** Runtime error
- **PinInvalid (801):** Invalid PIN
- **PinCancelled (802):** PIN entry canceled by user
- **ActionCancelled (803):** Action canceled by user
- **FirmwareError (804):** Firmware installation failed
- **ResponseUnexpectTypeError (805):** Unexpected response type
- **BridgeNetworkError (806):** Bridge network error
- **BridgeTimeoutError (807):** Bridge network timeout
- **BridgeNotInstalled (808):** Bridge not installed
- **PollingTimeout (809):** Ensure connect timeout
- **PollingStop (810):** Ensure connect stop polling
- **BlindSignDisabled (811):** Blind signing disabled on device
- **UnexpectPassphrase (812):** Unexpected passphrase
- **FileAlreadyExists (813):** File already exists
- **CheckDownloadFileError (814):** Check download file error
- **NotInSigningMode (815):** Not in signing mode
- **DataOverload (816):** Data overload
- **BridgeDeviceDisconnected (817):** Device disconnected during action
- **BTCPsbtTooManyUtxos (818):** BTC PSBT too many UTXOs
- **EmmcFileWriteFirmwareError (819):** EMMC file write firmware error
- **FirmwareVerificationFailed (820):** Firmware verification failed
- **BridgeNeedsPermission (821):** Web bridge connect needs permission

## 8. Web device (901–902)
- **WebDeviceNotFoundOrNeedsPermission (901):** Web USB/Bluetooth device not found or needs permission
- **WebDevicePromptAccessError (902):** Web USB/Bluetooth prompt access error

---