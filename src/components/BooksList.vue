<template>
  <div>
    <h1 class="mb-4 text-center">Books List</h1>

    <!-- Success Alert -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ successMessage }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="successMessage = ''">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="container">
      <!-- Button to create a new book, positioned at the top right -->
      <div class="d-flex justify-content-end mb-3">
        <router-link to="/create" class="btn btn-primary">
          Create Book
        </router-link>
      </div>

      <!-- Table with horizontal scrolling on small screens -->
      <div class="table-responsive">
        <table
          id="booksTable"
          class="table table-striped table-bordered table-hover"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Pages</th>
              <th>Rating</th>
              <th>Genres</th>
              <th>Reviews</th> <!-- New column for reviews -->
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book._id">
              <td>{{ book._id }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.pages }}</td>
              <td>{{ book.rating }}</td>
              <td>{{ book.genres.join(', ') }}</td> <!-- Display genres as comma-separated -->
              <td>
                <div v-if="book.reviews && book.reviews.length">
                  <ul>
                    <li v-for="review in book.reviews" :key="review.name">
                      <strong>{{ review.name }}:</strong> {{ review.body }}
                    </li>
                  </ul>
                </div>
                <div v-else>No reviews yet</div>
              </td>
              <td>
                <router-link
                  :to="'/book/' + book._id"
                  class="btn btn-primary mx-1 btn-sm"
                >
                  <i class="fas fa-eye"></i>
                </router-link>
                <router-link
                  :to="'/edit/' + book._id"
                  class="btn btn-success mx-1 btn-sm"
                >
                  <i class="fas fa-edit"></i>
                </router-link>
                <button
                  @click="deleteBook(book._id)"
                  class="btn btn-danger mx-1 btn-sm"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls with responsive buttons -->
      <div class="d-flex justify-content-end mt-3">
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li
              class="page-item"
              :class="{ disabled: currentPage <= 0 }"
            >
              <a
                class="page-link"
                @click="loadPage(currentPage - 1)"
                href="#"
                >Previous</a
              >
            </li>
            <li class="page-item">
              <a class="page-link" href="#"
                >{{ currentPage + 1 }}</a
              >
            </li>
            <li
              class="page-item"
              :class="{ disabled: !hasMoreBooks }"
            >
              <a
                class="page-link"
                @click="loadPage(currentPage + 1)"
                href="#"
                >Next</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        books: [],
        currentPage: 0,
        hasMoreBooks: true,
        isDeleting: false, // New state for loading during delete
        successMessage: '', // Success message for deletion
      };
    },
    mounted() {
      this.fetchBooks();
    },
    methods: {
      async fetchBooks() {
        try {
          const response = await fetch(`https://express-backend-n8nt.onrender.com/books?p=${this.currentPage}`);
          const data = await response.json();
          this.books = data;
          this.hasMoreBooks = data.length === 3; // If we get 3 books, assume there are more
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      },
      async deleteBook(id) {
        this.isDeleting = true; // Show loading state
        try {
          await fetch(`https://express-backend-n8nt.onrender.com/books/${id}`, { method: 'DELETE' });
          this.successMessage = 'Book deleted successfully!'; // Set success message
          this.fetchBooks(); // Reload books after delete
        } catch (error) {
          console.error('Error deleting book:', error);
        } finally {
          this.isDeleting = false; // Hide loading state
          setTimeout(() => {
            this.successMessage = ''; // Clear success message after 3 seconds
          }, 3000);
        }
      },
      loadPage(page) {
        if (page < 0) return;
        this.currentPage = page;
        this.fetchBooks();
      },
    }
  };
</script>

<style scoped>
  /* Optional: Adjust table and button sizes for small screens */
  .table-responsive {
      overflow-x: auto;
  }

  .pagination-sm .page-item .page-link {
      padding: 0.3rem 0.6rem;
      font-size: 0.875rem;
  }

  .btn-sm {
      padding: 0.3rem 0.5rem;
      font-size: 0.875rem;
  }

  /* Customize the close button for the alert */
  .alert .close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1rem;
  }
</style>
