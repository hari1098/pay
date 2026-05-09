# PaisaAds - Advertisement Platform

A full-stack classified ads platform for posting and browsing advertisements. Modern tech stack with Angular 20 frontend and Spring Boot 3 backend.

## Tech Stack

- **Frontend**: Angular 20, TypeScript, Angular Material, Standalone Components, Signals
- **Backend**: Spring Boot 3.3, Java 21, Spring Security, JPA/Hibernate, JWT Auth
- **Database**: H2 (in-memory for dev) or MySQL 8 (production)

## Project Structure

```
paisaads-angular/       # Angular 20 frontend
  src/
    app/
      components/       # Shared navbar, footer
      models/          # TypeScript interfaces
      pages/           # Route components
      services/        # HTTP, Auth, Ad, Category, Config
      environments/    # API URL config

paisaads-backend/       # Spring Boot backend (reference: use mock API for preview)
  pom.xml              # Maven configuration with H2 database
  src/main/java/
    config/            # Security, CORS, Web
    controller/        # REST endpoints
    entity/            # JPA entities
    repository/        # Spring Data repositories
    service/           # Business logic
    security/          # JWT utilities
```

## Quick Start - For Preview

### 1. Start Mock API Server
```bash
node /tmp/mock-api.js &
# or
npm run dev-api
```
Runs at http://localhost:8080 with sample data

### 2. Start Angular Frontend
```bash
cd paisaads-angular
npm install --legacy-peer-deps
npx ng serve
```
Runs at http://localhost:4200

### 3. Open Preview
Visit http://localhost:4200 in your browser

## Features

- **Home Page** - Hero section, category pills, line ads grid, featured cards
- **Search** - Filter ads by category, state, city
- **Authentication** - Phone/password login, JWT token-based
- **User Dashboard** - View my ads, post new ads, edit profile
- **Admin Dashboard** - Review/approve ads, manage users, categories, reports, configurations
- **Info Pages** - About Us, Contact, FAQ, Privacy, Terms & Conditions

## API Endpoints (Mock)

- `GET /api/line-ad/today` - Published line ads
- `GET /api/poster-ad/today` - Published poster ads
- `GET /api/video-ad/today` - Published video ads
- `GET /api/categories/tree` - Category hierarchy
- `GET /api/configurations/{key}` - Site config (about-us, faq, etc.)
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - User profile

## For Production - Spring Boot Backend

### Prerequisites
- Java 21 (JDK)
- Maven 3.9+
- MySQL 8

### Setup MySQL
```sql
CREATE DATABASE paisaads;
```

### Update Backend Config
Edit `paisaads-backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/paisaads
    username: root
    password: your-password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

### Run Backend
```bash
cd paisaads-backend
mvn clean package -DskipTests
java -jar target/paisaads-backend-1.0.0.jar
```
Runs at http://localhost:8080/api

### Run Frontend (Production Build)
```bash
cd paisaads-angular
npm run build
# Serve dist/paisaads-angular with any HTTP server
npx http-server dist/paisaads-angular -p 4200
```

## Test Accounts (Backend)

| Phone | Password | Role |
|-------|----------|------|
| 9999999999 | password123 | SUPER_ADMIN |
| 8888888888 | password123 | USER |
| 7777777777 | password123 | EDITOR |
| 6666666666 | password123 | REVIEWER |

## Key Pages

- `/` - Home
- `/search` - Search page
- `/search/results` - Results
- `/register` - Register
- `/login` - Login
- `/dashboard` - User dashboard (auth required)
- `/admin` - Admin dashboard (auth required)
- `/about-us`, `/contact`, `/faq`, `/privacy-policy`, `/terms-and-conditions` - Info pages

## Database Schema

**Entities**: User, Admin, Customer, MainCategory, CategoryOne, CategoryTwo, CategoryThree, LineAd, PosterAd, VideoAd, Image, Payment, AdComment, AdPosition, Otp

**Relationships**: 4-level category hierarchy, User has many Ads, Ads linked to Categories and Positions
