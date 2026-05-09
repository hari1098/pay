# PaisaAds - Advertisement Platform

A full-stack classified ads platform for posting and browsing advertisements across multiple categories. Supports three ad types: Line Ads (text), Poster Ads (image), and Video Ads.

## Architecture

```
Frontend (Angular 20 + TypeScript)  -->  Backend (Spring Boot 3 + Java 21)  -->  MySQL
        :4200                                      :8080
```

- **Frontend**: Angular 20, TypeScript, Angular Material, Standalone Components, Signals
- **Backend**: Spring Boot 3.3, Java 21, Spring Security, JPA/Hibernate, JWT Auth
- **Database**: MySQL 8 with auto-DDL
- **Auth**: JWT-based authentication with Bearer token, role-based access control

## Prerequisites

- **Java 21** (JDK)
- **Maven 3.9+**
- **Node.js 18+** and npm
- **Angular CLI 20** (`npm install -g @angular/cli@20`)
- **MySQL 8** running on localhost:3306

## Quick Start

### 1. Set up MySQL Database

```sql
CREATE DATABASE IF NOT EXISTS paisaads;
```

Update `paisaads-backend/src/main/resources/application.yml` with your MySQL credentials:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/paisaads?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: root
```

### 2. Start the Spring Boot Backend

```bash
cd paisaads-backend
mvn spring-boot:run
```

The API runs at http://localhost:8080/api. Seed data is auto-loaded on first startup.

### 3. Start the Angular Frontend

```bash
cd paisaads-angular
npm install
ng serve
```

The app runs at http://localhost:4200.

## Test Accounts

| Phone | Password | Role |
|-------|----------|------|
| 9999999999 | password123 | SUPER_ADMIN |
| 8888888888 | password123 | USER (Customer) |
| 7777777777 | password123 | EDITOR |
| 6666666666 | password123 | REVIEWER |

## Key Pages

- `/` - Home page with featured ads
- `/search` - Search and filter ads
- `/search/results` - Search results
- `/register` - Register new account
- `/login` - Login page
- `/dashboard` - User dashboard (my ads, post ad, profile)
- `/admin` - Admin dashboard (review ads, users, categories, reports, configurations)
- `/about-us`, `/contact`, `/faq`, `/privacy-policy`, `/terms-and-conditions` - Info pages

## API Endpoints

The API runs at: `http://localhost:8080/api/`

### Auth
- `POST /auth/login` - Login with phone + password
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Get current user profile (Bearer token required)

### Ads
- `GET /line-ad/today` - Get published line ads
- `GET /poster-ad/today` - Get published poster ads
- `GET /video-ad/today` - Get published video ads
- `POST /line-ad`, `POST /poster-ad`, `POST /video-ad` - Create ads (auth required)
- `PATCH /line-ad/{id}/approve` - Approve ad (admin)
- `PATCH /line-ad/{id}/reject` - Reject ad (admin)
- `GET /line-ad/my-ads` - Get user's own ads (auth required)
- `GET /line-ad/status/{status}` - Get ads by status

### Categories
- `GET /categories/tree` - Get full category hierarchy

### Dashboard & Reports
- `GET /ad-dashboard/user` - User dashboard stats (auth required)
- `GET /ad-dashboard/global` - Global dashboard stats
- `GET /reports/*` - Various reporting endpoints

### Configurations
- `GET /configurations/{key}` - Get site configuration (faq, about-us, ad-pricing, etc.)
- `POST /configurations/{key}` - Update configuration (admin)

## Database Schema

15 tables in MySQL:

- `user` - User accounts with roles
- `admin`, `customer` - User profile tables
- `otp` - One-time passwords for verification
- `main_category`, `category_one`, `category_two`, `category_three` - 4-level category hierarchy
- `line_ad`, `poster_ad`, `video_ad` - Advertisement tables
- `image` - Uploaded images
- `payment` - Payment records
- `ad_comment` - Review/approval comments
- `ad_position` - Ad placement positions

## Project Structure

```
project/
  paisaads-angular/        # Angular 20 frontend
    src/
      app/
        components/        # Shared components (navbar, footer)
        models/            # TypeScript interfaces
        pages/             # Page components (home, search, dashboard, admin)
        services/          # HTTP services (auth, ad, category, config)
        environments/      # Environment configs
  paisaads-backend/        # Spring Boot 3 backend
    src/main/java/com/paisaads/
      config/              # Security, CORS, Web configs
      controller/          # REST controllers
      dto/                 # Data transfer objects
      entity/              # JPA entities
      enums/               # Java enums
      repository/          # Spring Data JPA repositories
      security/            # JWT utility and filter
      service/             # Business logic services
    src/main/resources/
      application.yml      # Spring configuration
      data.sql             # Seed data
```

## Building for Production

### Frontend
```bash
cd paisaads-angular
ng build
# Output in dist/paisaads-angular/
```

### Backend
```bash
cd paisaads-backend
mvn package -DskipTests
# Output jar in target/paisaads-backend-1.0.0.jar
java -jar target/paisaads-backend-1.0.0.jar
```
