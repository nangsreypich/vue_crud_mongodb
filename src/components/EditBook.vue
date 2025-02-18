<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Edit Book</h1>
    <form @submit.prevent="updateBook" class="bg-light p-4 rounded shadow-sm">
      <div class="form-group mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" id="title" class="form-control" v-model="book.title" required>
      </div>
      <div class="form-group">
        <label for="author">Author</label>
        <input type="text" class="form-control" v-model="book.author" required>
      </div>
      <div class="form-group">
        <label for="pages">Pages</label>
        <input type="number" class="form-control" v-model="book.pages" required>
      </div>
      <div class="form-group">
        <label for="rating">Rating</label>
        <input type="number" class="form-control" v-model="book.rating" required>
      </div>
      <div class="form-group">
        <label for="genres">Genres</label>
        <input type="text" class="form-control" v-model="book.genres">
      </div>


      <!-- Add margin-top to the button container for spacing -->
      <div class="form-group mt-3">
        <button type="submit" class="btn btn-primary btn-block">Update</button>
        <router-link to="/" class="btn btn-danger btn-block mx-2">Back to Home</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: {
        title: '',
        author: '',
        pages: '',
        rating: '',
        genres: ''
      }
    };
  },
  mounted() {
    this.fetchBook();
  },
  methods: {
    // Fetch book details when component mounts
    async fetchBook() {
      try {
        const response = await fetch(`http://localhost:3000/books/${this.$route.params.id}`);
        if (response.ok) {
          const bookData = await response.json();
          // Populate book fields with fetched data
          this.book = {
            title: bookData.title,
            author: bookData.author,
            pages: bookData.pages,
            rating: bookData.rating,
            genres: bookData.genres.join(', ') // Assuming genres are an array, join them with commas
          };
        } else {
          alert('Error fetching book details');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    },
    // Update book details by sending a PATCH request to the backend
    async updateBook() {
      try {
        const response = await fetch(`http://localhost:3000/books/${this.$route.params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: this.book.title,
            author: this.book.author,
            pages: this.book.pages,
            rating: this.book.rating,
            genres: this.book.genres.split(',').map(genre => genre.trim()) // Split genres by commas
          })
        });

        const responseBody = await response.json();
        if (response.ok) {
          this.$router.push('/');
        } else {
          alert(`Error updating book: ${responseBody.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating book:', error);
        alert('Error updating book: Check console for details');
      }
    }
  }
};
</script>
