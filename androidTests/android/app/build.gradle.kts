plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.salesforce.androidsdk.reactnative.tests"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.salesforce.androidsdk.reactnative.tests"
        minSdk = 28
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testApplicationId = "com.salesforce.androidsdk.salesforcereact.tests"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    sourceSets {
        getByName("main") {
            java.srcDirs("src/main/java")
            res.srcDirs("src/main/res")
            assets.srcDirs("src/main/assets")
            manifest.srcFile("src/main/AndroidManifest.xml")
        }
        getByName("androidTest") {
            java.srcDirs("src/androidTest/java")
        }
    }

    buildFeatures {
        buildConfig = true
    }

    packaging {
        resources {
            excludes += setOf("META-INF/LICENSE", "META-INF/LICENSE.txt", "META-INF/DEPENDENCIES", "META-INF/NOTICE")
        }
    }

    lint {
        abortOnError = false
    }
}

kotlin {
    jvmToolchain(17)
}

dependencies {
    implementation("com.salesforce.mobilesdk:SalesforceReact")
    implementation("com.facebook.react:react-android:0.81.5")
    implementation("org.webkit:android-jsc:+")

    androidTestImplementation("androidx.test:runner:1.6.2")
    androidTestImplementation("androidx.test:rules:1.6.1")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.uiautomator:uiautomator:2.3.0")
}
