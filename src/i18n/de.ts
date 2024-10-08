export const de = {
  common: {
    error: "Fehler",
    success: "Erfolg",
  },
  measurementForm: {
    editMeasurement: "Messung editieren",
    addMeasurement: "Messung erfassen",
    saveButton: "Speichern",
    cancelButton: "Abbrechen",
    deleteButton: "Löschen",
    confirmDeleteText: "Bist du sicher, möchtest du diese Messung löschen?",
  },
  measurement: {
    createdAt: "Erfasst am",
    systolic: "Systolisch",
    diastolic: "Diastolisch",
    heartRate: "Puls",
    whichArm: "Welcher Arm?",
    left: "Links",
    right: "Rechts",
  },
  measurementList: {
    title: "Messungen",
    actions: {
      notSupportedByBrowser: "Dein Browser unterstützt das nicht",
      createNew: "Neu",
      export: "Export",
      import: "Import",
      share: "Teilen",
      deleteAll: "Alle löschen",
    },
    confirmDeleteText:
      "Das löscht ALLE Messungen, die die App selbst speichert. Bist du sicher, möchtest du das machen?",
  },
  menu: {
    aboutAndHelp: "Infos & Hilfe",
    home: "Home",
    chart: "Diagramm",
  },
  aboutAndHelp: {
    intro: "Diese App wurde gemacht, um Blutdruckmessungen einfach zu erfassen.",
    featuresIntro: "Sie unterstützt diese Funktionen:",
    feature0: "Speichern von Blutdruckmessungen",
    feature1: "Persistieren der Messungen für spätere App-Aufrufe (mehr dazu unten)",
    feature2: "Exportieren der Messungen in CSV Format",
    feature3: "Importieren der Messungen als CSV Format",
    feature4: "Visualisieren der Messungen als Linien-Diagramm",
    feature5: "die App funktioniert offline (mehr dazu unten)",
    dataPrivacyTitle: "Datenschutz",
    dataPrivacy:
      "Die App lebt nur in deinem Browser und speichert Daten in dessen Local Storage. Das ist nicht super sicher, wenn die App oder dein Gerät kompromittiert ist, könnten deine Daten gestohlen werden. In ihrem beabsichtigen Funktionsumfang übermittelt die App keine Daten ins Internet. Das kannst du sogar überprüfen in dem du die Netzwerkaufrufe im Netzwerktab der DevTools deines Browsers (F12) untersuchtst. Oder indem du den Quellcode anschaust auf ",
    dataTitle: "Daten",
    dataP1:
      "Die App speichert deine Messungen im Local Storage deines Browsers. Das bedeutet, wenn du die App auf dem selben Gerät und Browser zu einem späteren Zeitpunkt wieder öffnest, dann sollten die Messungen immernoch existieren und du kannst weitere erfassen.",
    dataP2:
      "Wenn du die App in einem anderen Browser oder auf einem anderen Gerät öffnest, existieren deine Messungen dort nicht. Wenn du den Private Mode verwendest, oder den Cache deines Browsers löschst, dann werden die Daten nicht persistiert. Vermutlich gibt es andere Fälle wie diese.",
    dataP3: "Es ist daher empfohlen, die Export und Import Funktion zu nutzen, um ein Backup der Daten zu erhalten.",
    dataP4: "Du bist dafür verantwortlich deine Backups sicher zu verwalten.",
    offlineTitle: "Die App offline nutzen",
    offlineContent:
      "Die App funktioniert auch offline. Nach dem ersten Zugriff online, solltest du sie anschliessend offline auch verwenden können.",
    feedbackTitle: "Feedback",
    feedback: "Gerne kannst du uns Feedback geben, in dem du ein Github Issue eröffnest: ",
    openSauceTitle: "Open Source",
    openSauce1: "Der Quellcode ist offen, du findest ihn auf ",
    openSauce2: "Gerne kannst du lesen, Feedback geben, contributen, forken, oder was auch immer.",
    techInfosTitle: "Tech Infos",
    techInfos:
      "Diese App ist in Vue3 geschrieben, nutzt die Composition API, Pinia, Typescript und Primevue. Deployed ist sie auf Cloudflare Pages.",
  },
  consent: {
    title: "Datenschutz",
    intro: "Siehst so aus, als nutzt du die App das erste Mal. Mit dem Weiternutzen akzeptierst du, dass:",
    appLivesInBrowser: "die App nur in deinem Browser existiert",
    doesntTransmitData: "die App keine Daten ins Internet übermittelt, sofern sie oder dein Gerät nicht gehackt wurde",
    localStorageConsent:
      "die App Daten im Local Storage deines Browsers speichern wird. Das ist nicht besonders sicher, wenn dein Gerät oder die App gehackt wurde, könnten deine Daten geklaut werden. Benutze auf eigenes Risiko.",
    persistingLimited:
      "obwohl die App daten in deinem Browser persistiert und wieder lädt, wenn du die App später wieder öffnest, hat diese Funktionalität Limtien",
    responsibleForBackups:
      "deshalb bist du dafür verantwortlich mit Hilfe der Export/Import Funktion Backups deiner Daten zu erstellen, und diese sicher aufzubewahren",
    noGuarantees: "die App kann Fehler beinhalten, es gibt keine Garantie für irgend etwas",
    accept: "Akzeptieren",
    deny: "Ablehnen",
  },
  chart: {
    amountOfDataPoints: "Weviel Datepünkt?",
    chartsTitle: "Diagramm",
  },
  toasts: {
    errorWhileDeletingMeasurement: "Das Löschen der Messung schlug fehl",
    successfullyDeletedMeasurement: "Messung erfolgreich gelöscht",
    errorWhileLoadingMeasurement: "Die Messung konnte nicht geladen werden",
    errorWhileImportingCsv: "Wegen einem Fehler konnte deine CSV Datei nicht importiert werden :(",
  },
};
