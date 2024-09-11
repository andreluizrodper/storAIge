const toasts = [];

let timer;
const timeOut = 5000;

const toastFunctions = {
  addToast(state, data) {
    const id = Math.floor(Math.random() * 1000000);
    data.id = id;
    state.toasts = [data, ...state.toasts];
    timer = setTimeout(() => {
      state.toasts = state.toasts.filter((toast) => toast.id !== data.id);
    }, timeOut);
  },
  setToasts(state, data) {
    state.toasts = data;
    clearTimeout(timer);
  },
};

export { toasts, toastFunctions };
