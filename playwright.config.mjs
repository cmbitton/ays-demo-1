import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  reporter: [['list']],
  timeout: 45000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {name:'phone',use:{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}},
    {name:'tablet',use:{viewport:{width:768,height:1024}}},
    {name:'desktop',use:{viewport:{width:1440,height:1000}}}
  ],
  webServer: {command:'npm run preview', url:'http://127.0.0.1:4173', reuseExistingServer:!process.env.CI}
});
