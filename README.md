# **DevToolBox - README**

## **Introduction**
DevToolBox is a web application that provides a variety of developer tools, including format conversion, text analysis, QR code generation, and more. The application is built with **ReactJS** for the frontend and **Spring Boot** for the backend, following a modular and scalable architecture.

---

## **Key Features**
- **Diverse Utility Tools**:
  - Format conversion (JSON ↔ CSV, XML ↔ JSON, Base64, etc.).
  - Text analysis (character, word, sentence, line statistics, reading time, etc.).
  - QR code generation (WiFi, URL, text, etc.).
  - Networking tools (IPv4 conversion, IPv4 range expansion, MAC address analysis, etc.).
  - Encryption tools (hashing, bcrypt, token generation, etc.).
  - Mathematical tools (percentage calculation, base conversion, etc.).

- **Account Management**:
  - User registration, login, and email verification.
  - Manage favorite tools and recently used tools.
  - Premium account support with advanced features.

- **Modern Interface**:
  - Simple and user-friendly design.
  - Fully responsive for various devices.

- **Extensibility**:
  - Plugin system allows adding new tools dynamically without modifying the core codebase.

---

## **System Architecture**
DevToolBox is designed with a layered architecture to ensure scalability and maintainability. The main components include:

1. **Frontend (ReactJS)**:
   - Built with a **Component-Based Architecture**.
   - State management using Context API.
   - React Router for navigation.

2. **Backend (Spring Boot)**:
   - Implements the **3-tier architecture**:
     - **Presentation Layer**: Handles HTTP requests and responses (Controllers).
     - **Business Logic Layer**: Processes application logic (Services).
     - **Data Access Layer**: Manages database interactions (Repositories).
   - Provides RESTful APIs for the frontend.
   - Uses MySQL as the database.

3. **Database (MySQL)**:
   - Stores user information, tools, categories, and related data.

4. **Plugin System**:
   - Dynamically loads plugins from the `uploaded-jars` directory to extend functionality.

---

## **Installation Guide**

### **1. System Requirements**
- **Node.js**: Version 16.x or higher.
- **npm**: Comes with Node.js.
- **Java**: Version 11 or higher.
- **Maven**: For building the backend.
- **MySQL**: For database storage.

---

### **2. Setting up the Database**
1. Open MySQL Workbench or any MySQL management tool.
2. Create a database named `devtool`:

```sql
CREATE DATABASE devtool;
```
3. Update the database connection details in the application.properties file:
```
spring.datasource.url=jdbc:mysql://localhost:3306/devtool
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```
### **3. Setting up the Backend**
1. Navigate to the devtoolbox-backend directory:
```
cd devtoolbox-backend
```
2. Install dependencies and build the project:
```
./mvn clean install
```
3. Run the backend application:
```
./mvn spring-boot:run
```
4. The backend will be available at http://localhost:8080.

### **4. Setting up the Frontend**
1. Navigate to the devtoolbox-frontend directory:
```
cd devtoolbox-frontend
```
2. Install dependencies:
```
npm install
```
3. Start the frontend application:
```
npm start
```
4. The frontend will be available at http://localhost:3000.

### Contact
Email: buihienn@gmail.com, hpvinh04@gmail.com
If you encounter any issues during installation or usage, feel free to contact us via email or create an issue on GitHub. ```


