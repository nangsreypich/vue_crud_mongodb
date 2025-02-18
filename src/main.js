import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router';
import $ from 'jquery'; // Import jQuery
import 'datatables.net'; // Import DataTables JavaScript
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Import DataTables CSS

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css';

window.$ = $; // Make jQuery globally available
createApp(App).use(router).mount('#app');
