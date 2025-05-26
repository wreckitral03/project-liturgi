import 'dotenv/config';

export default {
  expo: {
    name: 'project-liturgi',
    slug: 'project-liturgi',
    version: '1.0.0',
    extra: {
      EXPO_PUBLIC_API_BASE: process.env.EXPO_PUBLIC_API_BASE,
    },
  },
};