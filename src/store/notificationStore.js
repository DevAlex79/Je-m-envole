import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        message: '',
        type: '', // success, error, info, etc.
        show: false,
    }),
    actions: {
        setNotification(message, type = 'success') {
            this.message = message;
            this.type = type;
            this.show = true;
            setTimeout(() => {
                this.clearNotification();
            }, 3000);
        },
        clearNotification() {
            this.show = false;
            this.message = '';
            this.type = '';
        },
    },
});
