import { defineCustomElement } from "vue";
import App from "./App.ce.vue";

customElements.define("module-namespace_modulename", defineCustomElement(App));
