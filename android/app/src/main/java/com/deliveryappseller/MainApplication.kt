package com.deliveryappseller

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    // DefaultNewArchitectureEntryPoint.load() expects SoLoader to be initialized.
    // RN OSS uses a merged SoMapping; without it, loading feature-flag JNI can crash on startup.
    SoLoader.init(this, OpenSourceMergedSoMapping)
    // RN 0.82+ defaults to the New Architecture; ensure native entrypoint is loaded
    // so core TurboModules (e.g. PlatformConstants) are registered.
    DefaultNewArchitectureEntryPoint.load()
    loadReactNative(this)
  }
}
