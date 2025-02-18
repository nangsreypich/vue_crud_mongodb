<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Book Details</h1>
    <div v-if="book" class="card p-4">
      <p><strong>Title:</strong> <span class="font-weight-bold">{{ book.title }}</span></p>
      <p><strong>Author:</strong> <span class="font-weight-bold">{{ book.author }}</span></p>
      <p><strong>Pages:</strong> <span class="font-weight-bold">{{ book.pages }}</span></p>
      <p><strong>Rating:</strong> <span class="font-weight-bold">{{ book.rating }}</span></p>
      <p><strong>Genres:</strong> <span class="font-weight-bold">{{ book.genres.join(', ') }}</span></p>
      
      <div v-if="book.reviews.length">
        <strong>Reviews:</strong>
        <ul>
          <li v-for="(review, index) in book.reviews" :key="index">
            <p><strong>{{ review.name }}:</strong> {{ review.body }}</p>
          </li>
        </ul>
      </div>

      <router-link to="/" class="btn btn-primary mt-3">Back to Home</router-link>
    </div>
    <div v-else>
      <p class="text-center">Loading...</p>
      <router-link to="/" class="btn btn-primary mt-3">Back to Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: null
    };
  },
  mounted() {
    this.fetchBook();
  },
  methods: {
    async fetchBook() {
      const response = await fetch(`http://localhost:3000/books/${this.$route.params.id}`);
      this.book = await response.json();
    }
  }
}
</script>
