
# Courspresso

An educational web app that provides course recommendations, quiz modules, and a feedback system, powered by a React frontend and Spring Boot backend with MongoDB.

---

## 🔧 Project Structure

```
Courspresso/
├── mooc-web-app            # Frontend (React)
├── mooc-edtech-backend     # Backend (Spring Boot)
```

---

## 🚀 Setup Instructions

### 🖥️ Frontend (React)

#### 1. Navigate to the frontend folder:
```bash
cd mooc-web-app
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Create `.env` file:
Create a file named `.env` in the root of `mooc-web-app` and add:

```
REACT_APP_API_URL=http://localhost:8080
```

#### 4. Start the frontend server:
```bash
npm start
```

> The React app will run on `http://localhost:3000`.

---

### ⚙️ Backend (Spring Boot)

#### 1. Navigate to the backend folder:
```bash
cd mooc-edtech-backend
```

#### 2. MongoDB Setup:
Ensure MongoDB is accessible. This project connects to:

```
mongodb+srv://dhanesh76:DhAnEsHmongo5@mooc.sxm2q8w.mongodb.net/auth-portal
```

No `.env` is required unless your mentor wants to move it to a config file.

#### 3. Run the backend:
```bash
./mvnw spring-boot:run
```

> The backend will run on `http://localhost:8080`.

---

## 📦 Technologies Used

- **Frontend:** React, Axios
- **Backend:** Spring Boot, JWT, Spring Security, MongoDB
- **Database:** MongoDB Atlas (cloud)

---

## 🧪 Test APIs

You can test backend APIs using:

```
GET http://localhost:8080/courses
POST http://localhost:8080/api/auth/signin
```

Use Postman or your frontend for interactions.

---

## 🙋 Author

John Bellarmine  
GitHub: [@JohnBellar](https://github.com/JohnBellar)
