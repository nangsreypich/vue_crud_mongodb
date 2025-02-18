import { createRouter, createWebHistory } from 'vue-router';
import BooksList from '../components/BooksList.vue';
import CreateBook from '../components/CreateBook.vue';
import BookDetails from '../components/BookDetails.vue';
import EditBook from '../components/EditBook.vue';
import AboutUs from '../components/AboutUs.vue';
import ContactUs from '../components/ContactUs.vue';

const routes = [
  { path: '/', component: BooksList },
  { path: '/create', component: CreateBook },
  { path: '/book/:id', component: BookDetails },
  { path: '/edit/:id', component: EditBook },
  { path: '/about', component: AboutUs },
  { path: '/contact', component: ContactUs },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
