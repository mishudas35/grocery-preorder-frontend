<template>
  <div class="preorder-form">
    <form @submit.prevent="submitPreorder">
      <!-- Name Field -->
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="formData.name" required />
      </div>

      <!-- Email Field -->
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="formData.email" @input="checkEmail" required />
      </div>

      <!-- Conditionally Render Phone Field -->
      <div v-if="showPhoneField">
        <label for="phone">Phone:</label>
        <input type="tel" v-model="formData.phone" />
      </div>

      <!-- Product Dropdown -->
      <div>
        <label for="product">Product:</label>
        <select v-model="formData.product_id" required>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>

      <!-- Buttons Container -->
      <div class="button-container">
          <!-- Button to Redirect to Preorders List -->
          <button type="button" @click="goToPreorderList" class="preorder-list-button">
            Show Preorders List
          </button>
        <!-- Submit Button -->
        <button type="submit" class="submit-button">Submit Preorder</button>

      </div>
    </form>

    <!-- Success and Error Messages -->
    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        product_id: null,
      },
      products: [],  // List of products
      showPhoneField: false,  // Toggle phone field visibility
      successMessage: '',     // Success message to show after submission
      errorMessage: '',       // Error message to show if there's an issue
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    // Fetch products from the API
    async fetchProducts() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/preorder/products`);
        console.log(response);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.errorMessage = 'Failed to load products';
      }
    },
    // Check email and toggle phone field
    checkEmail() {
      this.showPhoneField = this.formData.email.endsWith('@xyz.com');
    },
    // Submit the preorder form
    async submitPreorder() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/preorder/store`,this.formData);
        console.log(response);
        this.successMessage = 'Pre-order successfully submitted!';
        this.errorMessage = ''; // Clear any previous error
        this.resetForm(); // Optionally reset form after successful submission
      } catch (error) {
        this.errorMessage = 'Failed to submit pre-order. Please try again.';
        this.successMessage = ''; // Clear any previous success message
      }
    },
    // Reset form after submission
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        product: null,
      };
      this.showPhoneField = false;
    },
    // Redirect to preorders list
    goToPreorderList() {
      this.$router.push({ path: '/preorder-list' });
    }
  },
};
</script>

<style scoped>
.preorder-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.preorder-form label {
  display: block;
  margin-bottom: 8px;
}

.preorder-form input,
.preorder-form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.submit-button,
.preorder-list-button {
  width: 48%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background-color: #007bff;
  color: white;
}

.submit-button:hover {
  background-color: #0056b3;
}

.preorder-list-button {
  background-color: #28a745;
  color: white;
}

.preorder-list-button:hover {
  background-color: #218838;
}
</style>
