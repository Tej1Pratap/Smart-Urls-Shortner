# Smart URL Shortener

A professional, full-stack URL shortening application built with React.js, Spring Boot, and MySQL.

## Features

- **Authentication**: Secure registration and login using JWT.
- **URL Shortening**: Convert long URLs into unique short codes.
- **Custom Codes**: Option to specify your own short URL.
- **Analytics**: Track clicks, last accessed time, and performance via interactive charts.
- **Expiry Management**: Set expiration dates for links.
- **QR Codes**: Automatically generate QR codes for every shortened URL.
- **Modern UI**: Fully responsive, dark-themed interface with glassmorphism and smooth animations.

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Chart.js & React-Chartjs-2
- Framer Motion (Animations)
- Axios (API Calls)

### Backend
- Spring Boot 3.2.5
- Spring Security (JWT)
- Spring Data JPA (MySQL)
- Hibernate
- Lombok
- Springdoc OpenAPI (Swagger)

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL Server

### Database Setup
1. Create a database named `smart_url_db` in your MySQL server.
2. Update `backend/src/main/resources/application.properties` with your MySQL credentials.

### Running the Backend
1. Navigate to the `backend` directory.
2. Run `./mvnw spring-boot:run` (or use your IDE).
3. The API will be available at `http://localhost:8080`.
4. Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Running the Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install`.
3. Run `npm run dev`.
4. The application will be available at `http://localhost:5173`.

## Folder Structure

```text
├── backend/
│   ├── src/main/java/com/smarturl/
│   │   ├── config/       # Configurations (CORS)
│   │   ├── controller/   # REST Controllers
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # JPA Entities
│   │   ├── exception/    # Global Exception Handling
│   │   ├── repository/   # Data Access Layer
│   │   ├── security/     # JWT & Security Logic
│   │   └── service/      # Business Logic
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable Components
│   │   ├── context/      # Auth Context
│   │   ├── pages/        # Main Pages
│   │   ├── services/     # API Integration
│   │   └── index.css     # Global Styles (Tailwind)
│   └── tailwind.config.js
└── README.md
```

## Security Features
- **JWT Authentication**: Secure stateless authentication.
- **Password Hashing**: BCrypt encryption for user passwords.
- **CORS Configuration**: Restricts access to trusted origins.
- **Protected Routes**: React router protection for authenticated pages.

## Author
Smart URL Shortener Team
