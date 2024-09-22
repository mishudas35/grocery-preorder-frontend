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

      <div class="g-recaptcha" data-sitekey="6Lf1sksqAAAAALp8HJb1A4rwNf1w6ONzlHF37Lfn" @captcha-success="onCaptchaVerified"></div>

      <!-- Submit Button -->
      <button type="submit">Submit Preorder</button>
    </form>

    <!-- Success and Error Messages -->
    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
/* global grecaptcha */

import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        product_id: null,
        recaptchaToken: '', // Add this field to store the reCAPTCHA token
      },
      products: [],  // List of products
      showPhoneField: false,  // Toggle phone field visibility
      successMessage: '',     // Success message to show after submission
      errorMessage: '',       // Error message to show if there's an issue
    };
  },
  mounted() {
    this.fetchProducts();
    // Load the reCAPTCHA script dynamically
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
    recaptchaScript.async = true;
    recaptchaScript.defer = true;
    document.head.appendChild(recaptchaScript);
  },
  methods: {
    // Fetch products from the API
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8000/preorder/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.errorMessage = 'Failed to load products';
      }
    },
       // Handle reCAPTCHA verification
       onCaptchaVerified() {
        console.log("Hello");
      this.formData.recaptchaToken = grecaptcha.getResponse();
    },
    // Check email and toggle phone field
    checkEmail() {
      this.showPhoneField = this.formData.email.endsWith('@xyz.com');
    },
    // Submit the preorder form
    async submitPreorder() {
      console.log(this.formData.recaptchaToken);
       // Ensure that the reCAPTCHA token is present
       if (!this.formData.recaptchaToken) {
        this.errorMessage = 'Please complete the reCAPTCHA verification.';
        return;
      }

      try {
        const response = await axios.post('http://localhost:8000/preorder/store', this.formData);
        console.log(response);
        this.successMessage = 'Pre-order successfully submitted!';
        this.errorMessage = ''; // Clear any previous error
        this.resetForm(); // Optionally reset form after successful submission
      } catch (error) {
        this.errorMessage = 'Failed to submit pre-order. Please try again.';
        this.successMessage = ''; // Clear any previous success message
        console.error('Error submitting preorder:', error);
      }
    },
    // Reset form after submission
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        product: null,
        recaptchaToken: '',
      };
      this.showPhoneField = false;
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

.preorder-form button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}

.preorder-form button:hover {
  background-color: #0056b3;
}
</style>
