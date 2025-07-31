---
icon: mobile-alt
---

# Native Mobile Integration

Complete guide for integrating OneKey Hardware SDK into native iOS and Android applications.

## Overview

OneKey Native Mobile SDK enables native iOS and Android applications to communicate with OneKey hardware wallets via Bluetooth Low Energy (BLE). This guide covers setup, configuration, and implementation for both platforms with comprehensive security and performance considerations.

## Prerequisites

- iOS 11.0+ / Android API 21+
- Bluetooth Low Energy (BLE) support
- OneKey device with Bluetooth capability (Mini, Touch)
- Xcode 12+ (iOS) / Android Studio 4.0+ (Android)

## iOS Integration

### Installation

#### CocoaPods

```ruby
# Podfile
platform :ios, '11.0'

target 'YourApp' do
  use_frameworks!
  
  pod 'OneKeySDK', '~> 1.0'
  pod 'CoreBluetooth'
end
```

#### Swift Package Manager

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/OneKeyHQ/onekey-ios-sdk.git", from: "1.0.0")
]
```

### iOS Setup

#### Info.plist Configuration

```xml
<!-- Info.plist -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey devices</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app needs Bluetooth to connect to OneKey devices</string>

<!-- iOS 13+ -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app uses Bluetooth to communicate with OneKey hardware wallets for secure cryptocurrency operations</string>
```

#### Swift Implementation

```swift
import UIKit
import OneKeySDK
import CoreBluetooth

class OneKeyManager: NSObject, ObservableObject {
    @Published var isConnected = false
    @Published var connectedDevice: OneKeyDevice?
    @Published var devices: [OneKeyDevice] = []
    
    private var sdk: OneKeySDK?
    private var centralManager: CBCentralManager?
    
    override init() {
        super.init()
        setupSDK()
        setupBluetooth()
    }
    
    private func setupSDK() {
        let config = OneKeySDKConfig(
            debug: true,
            manifest: OneKeyManifest(
                email: "developer@yourapp.com",
                appName: "Your iOS App",
                appUrl: "https://yourapp.com"
            )
        )
        
        sdk = OneKeySDK(config: config)
        sdk?.delegate = self
    }
    
    private func setupBluetooth() {
        centralManager = CBCentralManager(delegate: self, queue: nil)
    }
    
    func requestBluetoothPermissions() {
        guard let centralManager = centralManager else { return }
        
        switch centralManager.authorization {
        case .notDetermined:
            // Permissions will be requested automatically
            break
        case .denied, .restricted:
            showBluetoothPermissionAlert()
        case .allowedAlways:
            startScanning()
        @unknown default:
            break
        }
    }
    
    private func showBluetoothPermissionAlert() {
        DispatchQueue.main.async {
            let alert = UIAlertController(
                title: "Bluetooth Permission Required",
                message: "Please enable Bluetooth access in Settings to connect to OneKey devices.",
                preferredStyle: .alert
            )
            
            alert.addAction(UIAlertAction(title: "Settings", style: .default) { _ in
                if let settingsUrl = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(settingsUrl)
                }
            })
            
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
            
            // Present alert from top view controller
            if let topController = UIApplication.shared.windows.first?.rootViewController {
                topController.present(alert, animated: true)
            }
        }
    }
    
    func startScanning() {
        guard let sdk = sdk else { return }
        
        sdk.searchDevices { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let devices):
                    self?.devices = devices
                case .failure(let error):
                    print("Device search failed: \(error)")
                }
            }
        }
    }
    
    func connect(to device: OneKeyDevice) {
        guard let sdk = sdk else { return }
        
        sdk.connectDevice(device) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self?.isConnected = true
                    self?.connectedDevice = device
                case .failure(let error):
                    print("Connection failed: \(error)")
                }
            }
        }
    }
    
    func disconnect() {
        guard let sdk = sdk else { return }
        
        sdk.disconnectDevice { [weak self] result in
            DispatchQueue.main.async {
                self?.isConnected = false
                self?.connectedDevice = nil
            }
        }
    }
    
    func generateBitcoinAddress(path: String, completion: @escaping (Result<String, Error>) -> Void) {
        guard let sdk = sdk else {
            completion(.failure(OneKeyError.sdkNotInitialized))
            return
        }
        
        let params = BtcGetAddressParams(
            path: path,
            coin: "btc",
            showOnDevice: true
        )
        
        sdk.btcGetAddress(params) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
                    completion(.success(response.address))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
        }
    }
    
    func signBitcoinTransaction(
        inputs: [TxInput],
        outputs: [TxOutput],
        completion: @escaping (Result<String, Error>) -> Void
    ) {
        guard let sdk = sdk else {
            completion(.failure(OneKeyError.sdkNotInitialized))
            return
        }
        
        let params = BtcSignTransactionParams(
            coin: "btc",
            inputs: inputs,
            outputs: outputs
        )
        
        sdk.btcSignTransaction(params) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
                    completion(.success(response.serializedTx))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
        }
    }
}

// MARK: - OneKeySDKDelegate
extension OneKeyManager: OneKeySDKDelegate {
    func oneKeySDK(_ sdk: OneKeySDK, didConnectDevice device: OneKeyDevice) {
        DispatchQueue.main.async {
            self.isConnected = true
            self.connectedDevice = device
        }
    }
    
    func oneKeySDK(_ sdk: OneKeySDK, didDisconnectDevice device: OneKeyDevice) {
        DispatchQueue.main.async {
            self.isConnected = false
            self.connectedDevice = nil
        }
    }
    
    func oneKeySDK(_ sdk: OneKeySDK, didFailWithError error: Error) {
        print("OneKey SDK error: \(error)")
    }
}

// MARK: - CBCentralManagerDelegate
extension OneKeyManager: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .poweredOn:
            startScanning()
        case .poweredOff:
            print("Bluetooth is powered off")
        case .unauthorized:
            showBluetoothPermissionAlert()
        case .unsupported:
            print("Bluetooth is not supported on this device")
        case .resetting:
            print("Bluetooth is resetting")
        case .unknown:
            print("Bluetooth state is unknown")
        @unknown default:
            break
        }
    }
}
```

#### SwiftUI Integration

```swift
import SwiftUI

struct OneKeyView: View {
    @StateObject private var oneKeyManager = OneKeyManager()
    @State private var bitcoinAddress = ""
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Connection Status
                HStack {
                    Circle()
                        .fill(oneKeyManager.isConnected ? Color.green : Color.red)
                        .frame(width: 12, height: 12)
                    
                    Text(oneKeyManager.isConnected ? "Connected" : "Disconnected")
                        .font(.headline)
                }
                
                // Device List
                if !oneKeyManager.devices.isEmpty {
                    List(oneKeyManager.devices, id: \.id) { device in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(device.name)
                                    .font(.headline)
                                Text(device.id)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            Button("Connect") {
                                oneKeyManager.connect(to: device)
                            }
                            .disabled(oneKeyManager.isConnected)
                        }
                    }
                } else {
                    Button("Scan for Devices") {
                        oneKeyManager.startScanning()
                    }
                    .buttonStyle(.borderedProminent)
                }
                
                // Operations
                if oneKeyManager.isConnected {
                    VStack(spacing: 15) {
                        Button("Generate Bitcoin Address") {
                            generateBitcoinAddress()
                        }
                        .buttonStyle(.bordered)
                        
                        if !bitcoinAddress.isEmpty {
                            VStack(alignment: .leading) {
                                Text("Bitcoin Address:")
                                    .font(.headline)
                                Text(bitcoinAddress)
                                    .font(.system(.body, design: .monospaced))
                                    .textSelection(.enabled)
                            }
                            .padding()
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(8)
                        }
                        
                        Button("Disconnect") {
                            oneKeyManager.disconnect()
                        }
                        .buttonStyle(.bordered)
                        .foregroundColor(.red)
                    }
                }
                
                Spacer()
            }
            .padding()
            .navigationTitle("OneKey")
            .onAppear {
                oneKeyManager.requestBluetoothPermissions()
            }
            .alert("OneKey", isPresented: $showingAlert) {
                Button("OK") { }
            } message: {
                Text(alertMessage)
            }
        }
    }
    
    private func generateBitcoinAddress() {
        oneKeyManager.generateBitcoinAddress(path: "m/44'/0'/0'/0/0") { result in
            switch result {
            case .success(let address):
                bitcoinAddress = address
            case .failure(let error):
                alertMessage = "Failed to generate address: \(error.localizedDescription)"
                showingAlert = true
            }
        }
    }
}
```

## Android Integration

### Installation

#### Gradle Configuration

```gradle
// app/build.gradle
android {
    compileSdk 33
    
    defaultConfig {
        minSdk 21
        targetSdk 33
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'com.onekey:android-sdk:1.0.0'
    implementation 'androidx.bluetooth:bluetooth:1.0.0-alpha01'
    
    // Coroutines for async operations
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'
    
    // Lifecycle components
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.6.2'
}
```

### Android Setup

#### Manifest Permissions

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Android 12+ (API 31+) -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />

<uses-feature
    android:name="android.hardware.bluetooth_le"
    android:required="true" />
```

#### Kotlin Implementation

```kotlin
import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.onekey.sdk.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class OneKeyViewModel(private val context: Context) : ViewModel() {
    private val _isConnected = MutableStateFlow(false)
    val isConnected: StateFlow<Boolean> = _isConnected
    
    private val _devices = MutableStateFlow<List<OneKeyDevice>>(emptyList())
    val devices: StateFlow<List<OneKeyDevice>> = _devices
    
    private val _connectedDevice = MutableStateFlow<OneKeyDevice?>(null)
    val connectedDevice: StateFlow<OneKeyDevice?> = _connectedDevice
    
    private var sdk: OneKeySDK? = null
    private var bluetoothAdapter: BluetoothAdapter? = null
    
    init {
        initializeSDK()
        initializeBluetooth()
    }
    
    private fun initializeSDK() {
        val config = OneKeySDKConfig(
            debug = BuildConfig.DEBUG,
            manifest = OneKeyManifest(
                email = "developer@yourapp.com",
                appName = "Your Android App",
                appUrl = "https://yourapp.com"
            )
        )
        
        sdk = OneKeySDK(context, config).apply {
            setDeviceListener(object : OneKeyDeviceListener {
                override fun onDeviceConnected(device: OneKeyDevice) {
                    _isConnected.value = true
                    _connectedDevice.value = device
                }
                
                override fun onDeviceDisconnected(device: OneKeyDevice) {
                    _isConnected.value = false
                    _connectedDevice.value = null
                }
                
                override fun onError(error: OneKeyError) {
                    // Handle error
                }
            })
        }
    }
    
    private fun initializeBluetooth() {
        val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter
    }
    
    fun requestBluetoothPermissions(): List<String> {
        val permissions = mutableListOf<String>()
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // Android 12+
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_SCAN) 
                != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH_SCAN)
            }
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) 
                != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH_CONNECT)
            }
        } else {
            // Android 11 and below
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) 
                != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
            }
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH) 
                != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH)
            }
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_ADMIN) 
                != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH_ADMIN)
            }
        }
        
        return permissions
    }
    
    fun startScanning() {
        viewModelScope.launch {
            try {
                val foundDevices = sdk?.searchDevices() ?: emptyList()
                _devices.value = foundDevices
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
    
    fun connectToDevice(device: OneKeyDevice) {
        viewModelScope.launch {
            try {
                sdk?.connectDevice(device)
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
    
    fun disconnect() {
        viewModelScope.launch {
            try {
                sdk?.disconnectDevice()
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
    
    suspend fun generateBitcoinAddress(path: String): Result<String> {
        return try {
            val params = BtcGetAddressParams(
                path = path,
                coin = "btc",
                showOnDevice = true
            )
            
            val response = sdk?.btcGetAddress(params)
            if (response?.success == true) {
                Result.success(response.payload.address)
            } else {
                Result.failure(Exception(response?.payload?.error ?: "Unknown error"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun signBitcoinTransaction(
        inputs: List<TxInput>,
        outputs: List<TxOutput>
    ): Result<String> {
        return try {
            val params = BtcSignTransactionParams(
                coin = "btc",
                inputs = inputs,
                outputs = outputs
            )
            
            val response = sdk?.btcSignTransaction(params)
            if (response?.success == true) {
                Result.success(response.payload.serializedTx)
            } else {
                Result.failure(Exception(response?.payload?.error ?: "Unknown error"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

#### Activity Implementation

```kotlin
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

class MainActivity : ComponentActivity() {
    private val oneKeyViewModel: OneKeyViewModel by viewModels { 
        OneKeyViewModelFactory(this) 
    }
    
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.values.all { it }
        if (allGranted) {
            oneKeyViewModel.startScanning()
        } else {
            // Handle permission denial
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            OneKeyApp(oneKeyViewModel)
        }
        
        checkAndRequestPermissions()
    }
    
    private fun checkAndRequestPermissions() {
        val requiredPermissions = oneKeyViewModel.requestBluetoothPermissions()
        
        if (requiredPermissions.isNotEmpty()) {
            requestPermissionLauncher.launch(requiredPermissions.toTypedArray())
        } else {
            oneKeyViewModel.startScanning()
        }
    }
}

@Composable
fun OneKeyApp(viewModel: OneKeyViewModel = viewModel()) {
    val isConnected by viewModel.isConnected.collectAsState()
    val devices by viewModel.devices.collectAsState()
    val connectedDevice by viewModel.connectedDevice.collectAsState()
    
    var bitcoinAddress by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Connection Status
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .background(
                        color = if (isConnected) Color.Green else Color.Red,
                        shape = androidx.compose.foundation.shape.CircleShape
                    )
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (isConnected) "Connected" else "Disconnected",
                style = MaterialTheme.typography.headlineSmall
            )
        }
        
        Spacer(modifier = Modifier.height(20.dp))
        
        // Device List
        if (devices.isNotEmpty()) {
            LazyColumn {
                items(devices) { device ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = device.name,
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = device.id,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            
                            Button(
                                onClick = { viewModel.connectToDevice(device) },
                                enabled = !isConnected
                            ) {
                                Text("Connect")
                            }
                        }
                    }
                }
            }
        } else {
            Button(
                onClick = { viewModel.startScanning() }
            ) {
                Text("Scan for Devices")
            }
        }
        
        // Operations
        if (isConnected) {
            Spacer(modifier = Modifier.height(20.dp))
            
            Button(
                onClick = {
                    // Generate Bitcoin address
                    // This should be done in a coroutine
                }
            ) {
                Text("Generate Bitcoin Address")
            }
            
            if (bitcoinAddress.isNotEmpty()) {
                Spacer(modifier = Modifier.height(16.dp))
                Card(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Bitcoin Address:",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = bitcoinAddress,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = { viewModel.disconnect() },
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error
                )
            ) {
                Text("Disconnect")
            }
        }
    }
    
    if (showError) {
        AlertDialog(
            onDismissRequest = { showError = false },
            title = { Text("Error") },
            text = { Text(errorMessage) },
            confirmButton = {
                TextButton(onClick = { showError = false }) {
                    Text("OK")
                }
            }
        )
    }
}
```

## Cross-Platform Considerations

### Bluetooth Permissions

Both platforms require careful handling of Bluetooth permissions:

- **iOS**: Automatic permission request when accessing Bluetooth
- **Android**: Manual permission request with different requirements for API levels

### Device Discovery

- **iOS**: Uses Core Bluetooth framework
- **Android**: Uses BluetoothAdapter and BLE scanning

### Background Processing

- **iOS**: Limited background Bluetooth processing
- **Android**: Background location permission required for BLE scanning

### Security

- Both platforms provide secure Bluetooth communication
- Hardware-level security through OneKey device
- App-level security through proper permission handling

## Next Steps

- [Best Practices](best-practices.md) - Production deployment guidelines
- [API Reference](../api/device.md) - Complete API documentation
- [Troubleshooting](../resources/troubleshooting.md) - Common issues and solutions
- [React Native Integration](react-native.md) - Cross-platform mobile development
