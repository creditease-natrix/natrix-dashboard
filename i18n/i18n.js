import VueI18n from "vue-i18n";
import Vue from "vue";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale:'zh',
  messages: {
    zh: require("./langs/zh.json") // 中文语言包
  },
  silentTranslationWarn: true
});

export default i18n;
