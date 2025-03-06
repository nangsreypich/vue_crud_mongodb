<template>
  <div class="container mt-5">
    <h1 class="mb-4">Create New Book</h1>

    <!-- Success Alert -->
    <div v-if="message" :class="['alert', message.type]" role="alert">
      {{ message.text }}
    </div>

    <form @submit.prevent="createBook">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" v-model="book.title" required>
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
        <label for="genres">Genres (comma-separated)</label>
        <input type="text" class="form-control" v-model="book.genres">
      </div>

      <button type="submit" class="btn btn-primary btn-block mt-3">Create</button>
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
      },
      message: null // To store the success or error message
    };
  },
  methods: {
    async createBook() {
      try {
        // Split the genres input into an array and ensure proper trimming of spaces
        const genresArray = this.book.genres.split(',').map(genre => genre.trim());

        // Create a new object to send to the server, making sure genres is an array
        const bookToSend = {
          title: this.book.title,
          author: this.book.author,
          pages: this.book.pages,
          rating: this.book.rating,
          genres: genresArray // genres as an array here
        };

        // Send the POST request with the correct format
        const response = await fetch('https://express-backend-n8nt.onrender.com/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookToSend) // Sending the array in JSON
        });
        
        if (response.ok) {
          // Display success message
          this.message = { text: 'Book created successfully!', type: 'alert-success' };
          this.$router.push('/');
        } else {
          // Display error message
          this.message = { text: 'Error creating book. Please try again.', type: 'alert-danger' };
        }
      } catch (error) {
        // Handle any unexpected errors
        this.message = { text: 'Error creating book: ' + error.message, type: 'alert-danger' };
        console.error('Error creating book:', error);
      }
    }
  }
}
</script>
