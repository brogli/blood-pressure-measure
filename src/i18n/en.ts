export const en = {
  measurementForm: {
    editMeasurement: "Edit measurement",
    addMeasurement: "Add new measurement",
    saveButton: "Save",
    cancelButton: "Cancel",
    deleteButton: "Delete",
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
  },
  menu: {
    aboutAndHelp: "About & Help",
    home: "Home",
  },
  aboutAndHelp: {
    intro: "This app was created to help track blood pressure measurements with ease while providing maximum privacy.",
    dataPrivacyTitle: "Data Privacy",
    dataPrivacy:
      "The app only lives in your browser and saves data to your browser's local storage. It doesn't transmit any data to the internet. In fact you can verify this by inspecting the network calls in the network tab of your browser's DevTools (hit F12 and go to network tab), or by inspecting the code on ",
    dataTitle: "Data",
    dataP1:
      "The app stores your measurements in your browser's local storage. This means if you open the app again later on the same device and browser, the measurements should still exist and you can continue to add measurements.",
    dataP2:
      "If you open the app on a different browser or device, the data won't exist there. If you use private mode or clear your browser's cache, the data won't be persisted. Other cases like these probably exist.",
    dataP3: "It's therefore recommended to create backups usign the export and import functionality.",
    dataP4: "You're responsible for keeping your backup files secure.",
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
    intro: "Looks like you're using this app the first time. By continuing to use it you accept that:",
    appLivesInBrowser: "the app only lives in your browser",
    doesntTransmitData: "the app doesn't transmit any data to the internet",
    localStorageConsent: "the app will store data in your browser's local storage",
    persistingLimited:
      "while the app persists your measurements in your browser and loads them when you reopen the app, this functionality is limited",
    responsibleForBackups:
      "therefore you're responsible to back up your measurements using the export/import functions and to keep those files secure",
    noGuarantees: "the app may contain bugs, there's no guarantee for anything",
  },
};
