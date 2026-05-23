buildscript {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }

    dependencies {
        classpath("com.android.tools.build:gradle:8.12.0")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.3.20")
        classpath("org.jetbrains.dokka:dokka-gradle-plugin:2.0.0")
        classpath("org.jacoco:org.jacoco.core:0.8.14")
        classpath("io.github.gradle-nexus:publish-plugin:2.0.0")
    }
}
