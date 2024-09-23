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

      <div id="recaptcha" class="g-recaptcha"></div>
      
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
      recaptchaReady: false,  // Indicate when the reCAPTCHA is ready
    };
  },
  mounted() {
    this.fetchProducts();
    this.loadRecaptchaScript();
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
   // Load the reCAPTCHA script
   loadRecaptchaScript() {
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit';
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);

      // Set a global callback for when the reCAPTCHA script has loaded
      window.recaptchaLoaded = this.renderRecaptcha;
    },
    // Render the reCAPTCHA widget
    renderRecaptcha() {
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.render('recaptcha', {
          sitekey: process.env.VUE_APP_RECAPTCHA_SITE_KEY, // Replace with your reCAPTCHA site key
          callback: this.onCaptchaVerified, // This function will be called when the reCAPTCHA is successfully completed
        });
        this.recaptchaReady = true;
      } else {
        console.error('grecaptcha is not defined');
      }
    },
    // Handle reCAPTCHA verification
    onCaptchaVerified(token) {
      console.log('Captcha Verified:', token);
      this.formData.recaptchaToken = token; // Store the token in formData
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
     // Redirect to preorders list
     goToPreorderList() {
      this.$router.push({ path: '/preorder-list' });
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
  background-color: #00ff0d;
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
