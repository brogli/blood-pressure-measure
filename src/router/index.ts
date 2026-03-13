import { createRouter, createWebHistory } from "vue-router";
const HomeView = () => import("../views/HomeView.vue");
const AboutView = () => import("@/views/AboutView.vue");
const NewMeasurementView = () => import("@/views/AddMeasurementView.vue");
const EditMeasurementView = () => import("@/views/EditMeasurementView.vue");
const ChartView = () => import("@/views/ChartView.vue");

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
    {
      path: "/chart",
      name: "chart",
      component: ChartView,
    },
  ],
});

export default router;
