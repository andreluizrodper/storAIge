import { createStore } from "vuex";
import { toasts, toastFunctions } from "@/components/ui/toast/store";
import { set } from "firebase/database";

export default createStore({
  state: {
    user: {},
    account: null,
    otherHalfAccount: null,
    theme: "light",
    projectSheet: { status: false },
    taskSheet: { status: false },
    linkSheet: { status: false },
    sprintSheet: { status: false },
    toasts,
    update: [],
    dialog: null,
    teamDialog: { status: false },
    phone: null,
    restaurants: {},
    restaurant: {},
    createCouple: null,
  },
  mutations: {
    ...toastFunctions,
    setOtherHalfAccount(state, data) {
      state.otherHalfAccount = data;
    },
    setCreateCouple(state, data) {
      state.createCouple = data;
    },
    setRestaurants(state, data) {
      state.restaurants = data;
    },
    setRestaurant(state, data) {
      state.restaurant = data;
    },
    setDialog(state, data) {
      state.dialog = data;
    },
    setRedirect(state, data) {
      state.redirect = data;
    },
    setIsExpanded(state, data) {
      window.localStorage.setItem(
        "timeCrunchExpanded",
        data ? "true" : "false"
      );
      state.isExpanded = data;
    },
    setTeamDialog(state, data) {
      state.teamDialog = data;
    },
    setProjectSheet(state, data) {
      state.projectSheet = data;
    },
    setUpdate(state, data) {
      state.update = data;
    },
    setTaskSheet(state, data) {
      state.taskSheet = data;
    },
    setSprintSheet(state, data) {
      state.sprintSheet = data;
    },
    setLinkSheet(state, data) {
      state.linkSheet = data;
    },
    setTheme(state, data) {
      state.theme = data;
      document.getElementsByTagName("html")[0].setAttribute("class", data);
      window.localStorage.setItem("theme_timecrunch", data);
    },
    setUser(state, data) {
      state.user = data;
    },
    setAccount(state, data) {
      state.account = data;
    },
    setPhone(state, data) {
      state.phone = data;
    },
  },
});
