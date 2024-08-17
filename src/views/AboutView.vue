<script setup lang="ts">
import Panel from "primevue/panel";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <section class="about-parent">
    <Panel :header="t('menu.aboutAndHelp')">
      <p>
        {{ t("aboutAndHelp.intro") }}
      </p>
      <p>
        {{ t("aboutAndHelp.featuresIntro") }}
      </p>
      <ul>
        <li>{{ t("aboutAndHelp.feature0") }}</li>
        <li>{{ t("aboutAndHelp.feature1") }}</li>
        <li>{{ t("aboutAndHelp.feature2") }}</li>
        <li>{{ t("aboutAndHelp.feature3") }}</li>
        <li>{{ t("aboutAndHelp.feature4") }}</li>
        <li>{{ t("aboutAndHelp.feature5") }}</li>
      </ul>
    </Panel>

    <Panel :header="t('aboutAndHelp.dataPrivacyTitle')">
      <p>
        {{ t("aboutAndHelp.dataPrivacy")
        }}<a href="https://github.com/brogli/blood-pressure-measure" rel="noopener noreferrer" target="_blank"
          >Github.</a
        >
      </p>
    </Panel>

    <Panel :header="t('aboutAndHelp.dataTitle')">
      <p>
        {{ t("aboutAndHelp.dataP1") }}
      </p>
      <p>
        {{ t("aboutAndHelp.dataP2") }}
      </p>
      <p>
        {{ t("aboutAndHelp.dataP3") }}
      </p>
      <p>
        {{ t("aboutAndHelp.dataP4") }}
      </p>
    </Panel>

    <Panel :header="t('aboutAndHelp.offlineTitle')">
      <p>
        {{ t("aboutAndHelp.offlineContent") }}
      </p>
    </Panel>
    <Panel :header="t('aboutAndHelp.feedbackTitle')">
      <p>
        {{ t("aboutAndHelp.feedback") }}
        <a href="https://github.com/brogli/blood-pressure-measure/issues" rel="noopener noreferrer" target="_blank"
          >Github Issue.</a
        >
      </p>
    </Panel>
    <Panel :header="t('aboutAndHelp.openSauceTitle')">
      <p>
        {{ t("aboutAndHelp.openSauce1") }}
        <a href="https://github.com/brogli/blood-pressure-measure" rel="noopener noreferrer" target="_blank">Github.</a>
        {{ t("aboutAndHelp.openSauce2") }}
      </p>
    </Panel>
    <Panel :header="t('aboutAndHelp.techInfosTitle')">
      <p>
        {{ t("aboutAndHelp.techInfos") }}
      </p>
    </Panel>
  </section>
</template>

<style scoped>
.about-parent {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

p {
  margin-bottom: 0.7rem;
}
</style>
