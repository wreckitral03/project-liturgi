import 'dotenv/config';

export default {
  expo: {
    name: 'project-liturgi',
    slug: 'project-liturgi',
    version: '1.0.0',
    scheme: 'liturgi',
    extra: {
      EXPO_PUBLIC_API_BASE: process.env.EXPO_PUBLIC_API_BASE,
      eas: {
        projectId: "c77cb079-0b16-40cb-b42e-7c2a7dccb14f"
      }
    },
    ios: {
      bundleIdentifier: 'com.rickyalexander.liturgi',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: 'com.rickyalexander.liturgi', // Use the same pattern as iOS, but must be unique on Play Store
    },
  },
};