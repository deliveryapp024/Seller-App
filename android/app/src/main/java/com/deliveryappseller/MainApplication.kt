package com.deliveryappseller

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
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
    // loadReactNative() will load the RN entrypoint (New Architecture in RN 0.82+).
    // SoLoader must be initialized before the entrypoint loads any JNI libraries.
    // RN OSS requires a merged so-mapping so calls like `SoLoader.loadLibrary("react_featureflagsjni")`
    // are correctly mapped to the merged `libreactnative.so`.
    SoLoader.init(this, OpenSourceMergedSoMapping)
    loadReactNative(this)
  }
}
