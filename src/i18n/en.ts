export const en = {
  common: {
    error: "Error",
    success: "Success",
  },
  measurementForm: {
    editMeasurement: "Edit measurement",
    addMeasurement: "Add new measurement",
    saveButton: "Save",
    cancelButton: "Cancel",
    deleteButton: "Delete",
    confirmDeleteText: "Are you sure you want to delete this measurement?",
  },
  measurement: {
    createdAt: "Created at",
    systolic: "Systolic",
    diastolic: "Diastolic",
    heartRate: "Heart Rate",
    whichArm: "Which arm?",
    left: "Left",
    right: "Right",
  },
  measurementList: {
    title: "Measurements",
    actions: {
      notSupportedByBrowser: "Not supported by your browser",
      createNew: "New",
      export: "Export",
      import: "Import",
      share: "Share",
      deleteAll: "Delete all",
    },
    confirmDeleteText: "This will delete ALL measurements the app saves by itself. Sure you want to do this?",
  },
  menu: {
    aboutAndHelp: "About & Help",
    home: "Home",
    chart: "Diagram",
  },
  aboutAndHelp: {
    intro: "This app was created to help track blood pressure measurements with ease.",
    featuresIntro: "It supports these features:",
    feature0: "save blood pressure measurements",
    feature1: "persist measurements over multiple page loads (more info below)",
    feature2: "export measurements to csv",
    feature3: "import measurements from csv",
    feature4: "visualize measurements as line diagram",
    feature5: "app works offline (more below)",
    dataPrivacyTitle: "Data Privacy",
    dataPrivacy:
      "The app only lives in your browser and saves data to your browser's local storage. This isn't super secure, if the App or your device is compromised, someone could steal your data. In its intended purpose the App doesn't transmit any data to the internet. In fact you can verify this by inspecting the network calls in the network tab of your browser's DevTools (hit F12 and go to network tab), or by inspecting the code on ",
    dataTitle: "Data",
    dataP1:
      "The app stores your measurements in your browser's local storage. This means if you open the app again later on the same device and browser, the measurements should still exist and you can continue to add measurements.",
    dataP2:
      "If you open the app on a different browser or device, the data won't exist there. If you use private mode or clear your browser's cache, the data won't be persisted. Other cases like these probably exist.",
    dataP3: "It's therefore recommended to create backups usign the export and import functionality.",
    dataP4: "You're responsible for keeping your backup files secure.",
    offlineTitle: "Using the App offline",
    offlineContent:
      "The app works offline. Once you've accessed the app while being online, you should then be able to use it offline. You can use your mobile browser's \"Add to Home screen\" feature for easy access.",
    feedbackTitle: "Feedback",
    feedback: "You're welcome to provide feedback by an issue on Github: ",
    openSauceTitle: "Open Source",
    openSauce1: "The source code is open sourced with a permissive licence, you'll find it on",
    openSauce2: "You're welcome to read, give feedback, contribute, fork, whatever.",
    techInfosTitle: "Tech Infos",
    techInfos:
      "This app is written in Vue3, uses the Composition API, Pinia, Typescript and Primevue. It's deployed to Cloudflare Pages.",
  },
  consent: {
    title: "Data Privacy",
    intro: "Looks like you're using this app the first time. By continuing to use it you accept that:",
    appLivesInBrowser: "the app only lives in your browser",
    doesntTransmitData: "the app doesn't want to transmit data to the internet",
    localStorageConsent:
      "the app will store data in your browser's local storage. This isn't very secure, if your device or the App is compromised, someone could steal your data. Use at your own risk.",
    persistingLimited:
      "while the app persists your measurements in your browser and loads them when you reopen the app, this functionality is limited",
    responsibleForBackups:
      "therefore you're responsible to back up your measurements using the export/import functions and to keep those files secure",
    noGuarantees: "the app may contain bugs, there's no guarantee for anything",
    accept: "Accept",
    deny: "Deny",
  },
  chart: {
    amountOfDataPoints: "Weviel Datepünkt?",
    chartsTitle: "Diagram",
  },
  toasts: {
    errorWhileDeletingMeasurement: "Deleting  measurement failed",
    successfullyDeletedMeasurement: "Successfully deleted measurement",
    errorWhileLoadingMeasurement: "The measurement could not be loaded",
    errorWhileImportingCsv: "Due to an error your CSV file couldn't be imported :(",
  },
};
