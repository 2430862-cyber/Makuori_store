\# TDD: Technical Design Document



\## 1. Introduction

Makuori Store is an online store for handmade macramé products and hijabs. This document describes the system architecture, technologies, API design, and security implementation.



\## 2. Technology Stack

\- \*\*Frontend:\*\* React.js with TypeScript

\- \*\*Backend:\*\* FastAPI with Python

\- \*\*API:\*\* REST API

\- \*\*Database:\*\* SQLite for initial development

\- \*\*Version Control:\*\* Git and GitHub



\## 3. System Architecture

The application follows a client-server architecture.



1\. The frontend displays products and provides the user interface.

2\. The frontend sends HTTP requests to the backend through REST APIs.

3\. The backend validates requests, checks permissions, and processes business logic.

4\. The database stores users, products, and orders.

5\. The backend returns responses to the frontend.



\## 4. User Roles and Permissions

\- \*\*Customer:\*\* View products and manage their own orders.

\- \*\*Staff:\*\* View orders and update order status.

\- \*\*Admin:\*\* Manage products and all orders, and manage authorized system functions.



The backend will enforce role-based access control (RBAC). Users must not access resources or functions beyond their permissions.



\## 5. REST API Design



| Method | Endpoint | Purpose | Access |

|---|---|---|---|

| POST | /api/auth/register | Register a user | Public |

| POST | /api/auth/login | Log in | Public |

| GET | /api/products | List products | Public |

| POST | /api/products | Create a product | Admin |

| PUT | /api/products/{id} | Update a product | Admin |

| DELETE | /api/products/{id} | Delete a product | Admin |

| POST | /api/orders | Place an order | Customer |

| GET | /api/orders/me | View own orders | Customer |

| GET | /api/orders | View all orders | Staff/Admin |

| PATCH | /api/orders/{id}/status | Update order status | Staff/Admin |



\## 6. Database Design



\### Users

\- id

\- name

\- email

\- password\_hash

\- role



\### Products

\- id

\- name

\- description

\- price

\- stock

\- image\_url



\### Orders

\- id

\- customer\_id

\- total\_amount

\- status

\- created\_at



\### Order Items

\- id

\- order\_id

\- product\_id

\- quantity

\- unit\_price



\## 7. Security Design

\- Store passwords as secure hashes, never as plain text.

\- Validate and sanitize incoming data.

\- Authenticate users before allowing protected actions.

\- Enforce role-based permissions on the backend.

\- Use security scopes or permission checks for protected API endpoints.

\- Prevent customers from viewing or modifying other customers' orders.



\## 8. Error Handling

The backend will return appropriate HTTP status codes, such as:

\- 200: Successful request

\- 201: Resource created

\- 401: Authentication required or invalid credentials

\- 403: Permission denied

\- 404: Resource not found

\- 422: Invalid request data



\## 9. Implementation Plan

1\. Set up the frontend and backend.

2\. Design the database models.

3\. Implement authentication and authorization.

4\. Develop product management APIs.

5\. Develop order management APIs.

6\. Integrate the frontend with the backend.

7\. Test functionality, permissions, and error handling.



\## 10. Testing

Test registration, login, product browsing, order placement, and order management. Verify that each role can access only the features permitted to it.

