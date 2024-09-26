Grocery Pre-Order Frontend (Vue.js)
===================================

This is the frontend for the **Grocery Pre-Order System**, built using **Vue.js**. The frontend interacts with the Laravel backend to handle pre-order submissions, displays, and admin/manager functionality.

Features
--------

*   User-friendly interface for pre-order submission.
    
*   Admin and Manager dashboards for pre-order management.
    
*   Conditional form handling (based on email or phone).
    
*   Search, pagination, and filtering for pre-orders.
    
*   Role-based access control:
    
    *   **Admin**: Full access to manage pre-orders.
        
    *   **Manager**: View-only access.
        
*   Integration with **Google reCAPTCHA** for spam prevention.
    
*   Communication with the Laravel API for data management.
    

Tech Stack
----------

*   **Vue.js** (JavaScript Framework)
    
*   **Vue Router** (Single Page Navigation)
        
*   **Axios** (HTTP Requests)
    
*   **Bootstrap** (UI Styling)
    
*   **Google reCAPTCHA** (Spam prevention)
    

Prerequisites
-------------

*   **Node.js** >= 14.x
    
*   **npm** or **yarn**
    

Installation
------------

1. git https://github.com/mishudas35/grocery-preorder-frontend.git
   cd grocery-backend-frontend

2.   npm install
    
3. Add below credentials to .env

VUE_APP_API_BASE_URL=http://localhost:8000

VUE_APP_RECAPTCHA_SITE_KEY="6Lf1sksqAAAAALp8HJb1A4rwNf1w6ONzlHF37Lfn"

4. npm run serve