export const ch = {
  common: {
    error: "Fähler",
    success: "Erfolg",
  },
  measurementForm: {
    editMeasurement: "Mässig ändere",
    addMeasurement: "Mässig erfassä",
    saveButton: "Speicherä",
    cancelButton: "Abbrechä",
    deleteButton: "Löschä",
    confirmDeleteText: "Bisch sicher, wottsch die Mässig löschä?",
  },
  measurement: {
    createdAt: "Erfasst am",
    systolic: "Systolisch",
    diastolic: "Diastolisch",
    heartRate: "Puls",
    whichArm: "Welle Arm?",
    left: "Links",
    right: "Rechts",
  },
  measurementList: {
    title: "Mässigä",
    actions: {
      notSupportedByBrowser: "Din Browser unterstützt das nöd",
      createNew: "Neu",
      export: "Export",
      import: "Import",
      share: "Teilä",
      deleteAll: "Alli löschä",
    },
    confirmDeleteText: "Das löscht ALLI dini Mässige wo d App selber speicheret. Bisch sicher wotsch das mache?",
  },
  menu: {
    aboutAndHelp: "Infos & Hilfe",
    home: "Home",
    chart: "Diagramm",
  },
  aboutAndHelp: {
    intro: "Die App isch gmacht worde zum Bluetdruckmässigä eifach erfasse.",
    featuresIntro: "Sie hät folgendi Funktionalitäte:",
    feature0: "Speichärä von Bluetdruckmässigä",
    feature1: "S'Persistiere vode Mässigä für spöteri App-Ufrüef (meh dezue une)",
    feature2: "S'Exportiere vode Mässigä noch CSV",
    feature3: "S'Importiere vode Mässige als CSV",
    feature4: "S'Visualisiere vode Mässige als Linie-Diagramm",
    feature5: "d'App funktioniert offline (meh dezue une)",
    dataPrivacyTitle: "Dateschutz",
    dataPrivacy:
      'Die App lebt nur i dim Browser und speicheret Datä i sin Local Storage. Das isch allerdings nöd super save, wenn d App oder dis Grät "ghacked" sind, denn wärs mögli das öbber dini Date chlaut. I ihrem adenkte Funktionsumfang übermittlet d\'App kei Date is Internet. Das chasch sogar überprüefe, indem du Netzwerkufrüef ide DevTools vo dim Browser gosch go aluege (F12, Netzwerktab). Oder indemet de Quellcode gosch go aluege uf ',
    dataTitle: "Datä",
    dataP1:
      "D App speicheret dini Mässigä im Local Storage vo dim Browser. Das bedütet, wennt d App ufem gliche Grät im gliche Browser nomel uftuesch spöter, denn söttet d Mässigä immerno existiere und chasch witeri erfasse.",
    dataP2:
      "Wennt d'App imene andere Browser oder ufeme andere Grät öffnisch, existieret dini Mässigä döt nöd. Wennt de Private Mode verwendisch, oder de Cache vo dim Browser löschisch, denn werdet Date nöd gspeicheret. Vermuetli gits no meh so Fäll wie die.",
    dataP3:
      "Es isch drum empfohle, d Export und Import Funktione z'nutze, zum es Backup vode Date exportiere und z'importiere, falls nötig.",
    dataP4: "Du bist verantwortlich defür dini Backup-Files sicher z verwalte.",
    offlineTitle: "D'App offline nutze",
    offlineContent:
      "D'App funktioniert au offline. Wennt mol online gsi bisch zum si zum erste Mol öffne, denn söttsch si nocher au offline chönne nutze.",
    feedbackTitle: "Feedback",
    feedback: "Chasch gern Feedback geh, indemt es Github Issue eröffnisch: ",
    openSauceTitle: "Open Source",
    openSauce1: "Der Quellcode isch offen, du findschen uf ",
    openSauce2: "Gerne chasch go läse, Feedback gegeh, contributä, forkä, oder was auch immer.",
    techInfosTitle: "Tech Infos",
    techInfos:
      "Die App isch in Vue3 gschribe, nutzt d'Composition API, Pinia, Typescript und Primevue. Deployt isch si uf  App ist in Vue3 geschrieben, nutzt die Composition API, Pinia, Typescript und Primevue. Deployed ist sie auf Cloudflare Pages.",
  },
  consent: {
    title: "Dateschutz",
    intro: "Gseht so us, als benutzisch die App s erste Mol. Mitem Witerbenutze akzeptiersch, dass:",
    appLivesInBrowser: "d'App nur in dim Browser existiert",
    doesntTransmitData: "d'App kei Date ins Internet schickt, sofern si oder dis Grät nöd ghackt worde isch",
    localStorageConsent:
      "d'App Date im Local Storage vo dim Browsers wird speichere. Das isch nöd super sicher, wenn dis Grät oder d App ghackt worde isch, chöntet dini Date klaut werde. Benutzes uf eiges Risiko",
    persistingLimited:
      "obwohl d'App Date i dim Browser persistiert und wieder ladt, wenn d'App spöter wieder öffnisch, hät die Funktionalität ihri Limit",
    responsibleForBackups:
      "drum bisch selber defür verantwortlich mit der Export/Import Funktion Backups vo dine Date z'mache, und die sicher ufzbewahre",
    noGuarantees: "d'App cha fehlerhaft si, es git kei Garantie für irgend öppis",
    accept: "Akzeptierä",
    deny: "Ablehnä",
  },
  chart: {
    amountOfDataPoints: "Weviel Datepünkt?",
    chartsTitle: "Diagramm",
  },
  toasts: {
    errorWhileDeletingMeasurement: "Bim Lösche vo dinnere Mässig isch was schiefgange",
    successfullyDeletedMeasurement: "Mässig erfolgrich glöscht",
    errorWhileLoadingMeasurement: "D Mässig het nöd chönne glade werde",
    errorWhileImportingCsv: "Wägeme Fähler chame dis CSV File nöd importiere :(",
  },
};
