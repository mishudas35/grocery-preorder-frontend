<template>
  <div class="preorder-list">
       <!-- Top Bar with Logout -->
       <div class="top-bar">
        <button @click="logout" class="logout-btn">Logout</button>
      </div>

    <!-- Create Preorder Button -->
    <button @click="goToCreatePreorder" class="create-preorder-btn">
      Create Preorder
    </button>

    <!-- Search Input -->
    <input
      type="text"
      v-model="searchQuery"
      @input="fetchPreOrders"
      placeholder="Search pre-orders"
      class="search-input"
    />

    <!-- Table for Pre-Orders -->
    <table>
      <thead>
        <tr>
          <th @click="changeOrder('name')">Name <span :class="getOrderDirection('name')"></span></th>
          <th @click="changeOrder('email')">Email <span :class="getOrderDirection('email')"></span></th>
          <th @click="changeOrder('product')">Product <span :class="getOrderDirection('product')"></span></th>
          <th @click="changeOrder('created_at')">Created At <span :class="getOrderDirection('created_at')"></span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="preorder in preOrders.data" :key="preorder.id">
          <td>{{ preorder.name }}</td>
          <td>{{ preorder.email }}</td>
          <td>{{ preorder.product.name }}</td>
          <td>{{ preorder.created_at }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === preOrders.last_page">Next</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",           // The search term
      preOrders: [],             // List of preorders from the API
      currentPage: 1,            // Current page number
      perPage: 10,               // Number of results per page
      orderBy: "created_at",      // Default order field
      orderDirection: "desc",    // Default order direction (descending)
    };
  },
  mounted() {
    this.fetchPreOrders(); // Fetch pre-orders when component mounts
  },
  methods: {
      // Navigate to the create preorder form
      goToCreatePreorder() {
      this.$router.push({ name: "PreOrderForm" }); // Adjust the route name according to your router config
    },

    // Fetch pre-orders from API with search, pagination, and order options
    async fetchPreOrders() {
      const params = {
        search: this.searchQuery,
        page: this.currentPage,
        per_page: this.perPage,
        order_by: this.orderBy,
        order_direction: this.orderDirection,
      };

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/preorder/list`,{ params });
        this.preOrders = response.data;
        console.log(this.preOrders);
      } catch (error) {
        console.error("Error fetching pre-orders:", error);
      }
    },
    async logout() {
    await axios.post('/api/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.$router.push({ name: 'Login' });
  },

    // Change the order field and direction
    changeOrder(field) {
      if (this.orderBy === field) {
        // Toggle between ascending and descending
        this.orderDirection = this.orderDirection === "asc" ? "desc" : "asc";
      } else {
        this.orderBy = field;
        this.orderDirection = "asc"; // Default to ascending when changing the field
      }
      this.fetchPreOrders();
    },

    // Change the current page and fetch pre-orders
    changePage(page) {
      if (page < 1 || page > this.preOrders.last_page) return; // Prevent going out of bounds
      this.currentPage = page;
      this.fetchPreOrders();
    },

    // Get the appropriate arrow for the ordering direction
    getOrderDirection(field) {
      if (this.orderBy === field) {
        return this.orderDirection === "asc" ? "↑" : "↓";
      }
      return "";
    },
  },
};
</script>

<style scoped>
.create-preorder-btn {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
/* Style for Pre-Order List */
.preorder-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  cursor: pointer;
}

thead th span {
  margin-left: 8px;
}

tbody td {
  padding: 10px;
  border: 1px solid #ccc;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #ccc;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: #f8f9fa;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>
