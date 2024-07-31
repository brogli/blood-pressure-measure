import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import NewMeasurementView from "@/views/AddMeasurementView.vue";
import EditMeasurementView from "@/views/EditMeasurementView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/new",
      name: "new",
      component: NewMeasurementView,
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: EditMeasurementView,
      props: true,
    },
  ],
});

export default router;
