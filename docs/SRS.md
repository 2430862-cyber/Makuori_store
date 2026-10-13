\# SRS: Software Requirements Specification



\## 1. Introduction

Makuori Store is an online store for handmade macramé products and hijabs. This document describes the functional and non-functional requirements of the system.



\## 2. User Roles

\- \*\*Customer:\*\* Browse products and place orders.

\- \*\*Admin:\*\* Add, edit, and delete products; manage orders.

\- \*\*Staff:\*\* View orders and update order status.



\## 3. Functional Requirements



\### 3.1 User Authentication

\- Users can register and log in.

\- Users must provide valid credentials.

\- The system must restrict access to protected features.



\### 3.2 Product Management

\- Customers can view available products and their details.

\- Admins can add, update, and delete products.



\### 3.3 Order Management

\- Customers can place orders for available products.

\- Customers can view their own orders.

\- Staff can update order status.

\- Admins can view and manage all orders.



\### 3.4 Authorization

\- The system must enforce role-based access control (RBAC).

\- Customers cannot access administrative functions.

\- Only authorized staff and admins can manage order status.



\## 4. Non-Functional Requirements

\- \*\*Security:\*\* Passwords must be securely hashed.

\- \*\*Usability:\*\* The interface should be simple and understandable.

\- \*\*Performance:\*\* Requests should be processed efficiently.

\- \*\*Reliability:\*\* The system should handle invalid input appropriately.

\- \*\*Maintainability:\*\* The code should be organized and easy to update.



\## 5. External Interface Requirements

\- Frontend: React.js with TypeScript.

\- Backend: FastAPI with Python.

\- API: RESTful endpoints using HTTP methods.

\- Database: Stores user, product, and order information.



\## 6. Assumptions and Constraints

\- Users need an internet connection to access the application.

\- Users must log in to place orders.

\- Online payment is not included in the initial version.



\## 7. Acceptance Criteria

\- Users can register and log in.

\- Customers can browse products and place orders.

\- Admins can manage products.

\- Staff can update order status.

\- Unauthorized access is rejected.

