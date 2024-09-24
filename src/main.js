import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    console.log("Interceptor Token:", token); // Log the token

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log("Authorization Header being sent:", config.headers['Authorization']);
    }
    return config;
});


const app = createApp(App);
app.use(router); // Use the router instance
app.mount('#app');

