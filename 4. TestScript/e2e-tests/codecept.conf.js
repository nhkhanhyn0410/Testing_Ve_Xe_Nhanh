const { setHeadlessWhen, setWindowSize } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);
setWindowSize(1920, 1080);

exports.config = {
  tests: './tests/scenarios/**/*_test.js',
  output: './output',

  helpers: {
    Playwright: {
      url: process.env.BASE_URL || 'https://ve-xe-nhanh-testing-frontend.vercel.app',
      show: true,
      browser: 'chromium',
      waitForTimeout: 30000,
      waitForAction: 800,
      waitForNavigation: 'networkidle',
      windowSize: '1920x1080',
    },

    REST: {
      endpoint: process.env.API_URL || 'https://ve-xe-nhanh.onrender.com/api/v1',
      defaultHeaders: {
        'Content-Type': 'application/json'
      }
    },

    JSONResponse: {}
  },

  include: {
    I: './steps_file.js',
    homePage: './tests/pages/HomePage.js',
    loginPage: './tests/pages/LoginPage.js',
    tripsPage: './tests/pages/TripsPage.js',
    tripDetailPage: './tests/pages/TripDetailPage.js',
    passengerInfoPage: './tests/pages/PassengerInfoPage.js',
  },

  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    autoDelay: {
      enabled: true,
      delayAfter: 200
    },
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
      outputDir: './output/allure-results'
    }
  },

  mocha: {
    reporterOptions: {
      reportDir: './output',
      reportFilename: 'report',
      overwrite: true,
      html: true,
      json: false,
    }
  },

  stepTimeout: 60000,

  name: 'vexenhanh-e2e-tests',

  multiple: {
    parallel: {
      chunks: 2,
      browsers: ['chromium']
    },
    smoke: {
      grep: '@smoke',
      browsers: ['chromium']
    }
  }
}
