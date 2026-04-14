# **🌿 AI-Powered Crop Disease Detection System**

A full-stack web application that identifies plant diseases from leaf images using deep learning.  
Built with React.js, Node.js, Express, PostgreSQL, and TensorFlow.js.

## **📌 Table of Contents**

* [Overview](https://www.google.com/search?q=%23-overview)  
* [Key Features](https://www.google.com/search?q=%23-key-features)  
* [Tech Stack](https://www.google.com/search?q=%23-tech-stack)  
* [AI Model](https://www.google.com/search?q=%23-ai-model)  
* [Supported Diseases](https://www.google.com/search?q=%23-supported-diseases)  
* [Project Structure](https://www.google.com/search?q=%23-project-structure)  
* [Installation & Setup](https://www.google.com/search?q=%23-installation--setup)  
* [Environment Variables](https://www.google.com/search?q=%23-environment-variables)  
* [Running the Application](https://www.google.com/search?q=%23-running-the-application)  
* [API Endpoints](https://www.google.com/search?q=%23-api-endpoints)  
* [Usage Guide](https://www.google.com/search?q=%23-usage-guide)

## **📖 Overview**

Crop diseases cause up to **40% of agricultural losses** annually. Traditional diagnosis relies on scarce experts, especially in rural areas. This system democratizes access to agricultural expertise by providing an **instant, AI-driven diagnosis** from a simple leaf photo.  
The application allows users to upload an image or capture one via camera, and within 2–5 seconds returns the disease name (or "healthy") with a confidence score. All detection records are stored in a PostgreSQL database for historical tracking.

## **✨ Key Features**

* **Dual input methods** – Upload image (drag & drop or browse) or capture live with camera (WebRTC)  
* **Real-time AI inference** – TensorFlow.js model runs directly inside Node.js (no external API calls)  
* **15 disease classes** covering Tomato, Potato, and Bell Pepper  
* **Detection history** – View past predictions with timestamps and confidence badges  
* **Delete records** – Manage history with one-click deletion  
* **Responsive UI** – Mobile‑first glassmorphism design, works on any device  
* **Lightweight & self-contained** – No Python or cloud AI services required

## **🧰 Tech Stack**

| Layer | Technologies |
| :---- | :---- |
| **Frontend** | React 18, Vite, JavaScript ES2022, CSS3, WebRTC, Canvas API, Fetch API |
| **Backend** | Node.js 18+, Express 5, TensorFlow.js 4.22, Multer, jpeg-js, Sequelize ORM |
| **Database** | PostgreSQL 14+ |
| **AI Model** | MobileNetV2 (pre-trained) \+ custom classification head trained via Google Teachable Machine |

## **🤖 AI Model**

* **Architecture:** MobileNetV2 (lightweight CNN) \+ Dense layer with Softmax  
* **Training:** Transfer learning on PlantVillage dataset via Google Teachable Machine  
* **Input:** $224 \\times 224$ RGB image normalized to $\[-1, 1\]$  
* **Output:** Probability distribution over 15 classes  
* **Inference:** TensorFlow.js in Node.js – model is cached after first load for low latency

## **🌱 Supported Diseases (15 classes)**

| Crop | Condition / Disease | Class Label |
| :---- | :---- | :---- |
| Bell Pepper | Healthy | Pepper\_bell\_healthy |
| Bell Pepper | Bacterial Spot | Pepper\_bell\_Bacterial\_spot |
| Potato | Healthy | Potato\_healthy |
| Potato | Early Blight | Potato\_Early\_blight |
| Potato | Late Blight | Potato\_Late\_blight |
| Tomato | Healthy | Tomato\_healthy |
| Tomato | Bacterial Spot | Tomato\_Bacterial\_spot |
| Tomato | Early Blight | Tomato\_Early\_blight |
| Tomato | Late Blight | Tomato\_Late\_blight |
| Tomato | Leaf Mold | Tomato\_Leaf\_Mold |
| Tomato | Septoria Leaf Spot | Tomato\_Septoria\_leaf\_spot |
| Tomato | Spider Mites (Two-Spotted) | Tomato\_Spider\_mites\_Two\_spotted\_spider\_mite |
| Tomato | Target Spot | Tomato\_Target\_Spot |
| Tomato | Tomato Mosaic Virus | Tomato\_Tomato\_mosaic\_virus |
| Tomato | Yellow Leaf Curl Virus | Tomato\_Tomato\_YellowLeaf\_Curl\_Virus |

## **📁 Project Structure**

crop\_disease\_project/  
├── backend/  
│   ├── ai\_model/  
│   │   ├── model.json          \# TensorFlow.js model topology  
│   │   ├── metadata.json       \# Class labels & training info  
│   │   └── weights.bin         \# Trained weights  
│   ├── uploads/                \# Temporary storage for uploaded images  
│   ├── src/  
│   │   ├── config/  
│   │   │   └── database.js     \# Sequelize PostgreSQL config  
│   │   ├── controllers/  
│   │   │   └── detectionController.js  
│   │   ├── middleware/  
│   │   │   └── upload.js       \# Multer file upload config  
│   │   ├── models/  
│   │   │   └── Record.js       \# Sequelize model for detection\_records  
│   │   ├── routes/  
│   │   │   └── detectionRoutes.js  
│   │   └── services/  
│   │       └── aiService.js    \# Model loading, preprocessing, inference  
│   ├── .env.example  
│   ├── init-db.js              \# Creates database if not exists  
│   ├── server.js               \# Express app entry point  
│   └── package.json  
│  
└── frontend/  
    ├── src/  
    │   ├── components/  
    │   │   ├── UploadCard.jsx  
    │   │   ├── FileUpload.jsx  
    │   │   ├── CameraCapture.jsx  
    │   │   ├── PredictionResult.jsx  
    │   │   ├── HistoryCard.jsx  
    │   │   └── Loader.jsx  
    │   ├── services/  
    │   │   └── api.js          \# HTTP calls to backend  
    │   ├── App.jsx  
    │   ├── main.jsx  
    │   └── index.css  
    ├── index.html  
    ├── vite.config.js  
    └── package.json

## **🛠 Installation & Setup**

### **Prerequisites**

* **Node.js** 18.x or higher  
* **PostgreSQL** 14.x or higher (running locally or remotely)  
* **npm** 8.x or higher

### **1\. Clone the repository**

git clone \[https://github.com/krnike96/crop-disease-detection\](https://github.com/krnike96/crop-disease-detection)  
cd crop-disease-detection

### **2\. Backend Setup**

cd backend  
npm install

1. Create a .env file (see [Environment Variables](https://www.google.com/search?q=%23-environment-variables)).  
2. Initialize the database:

node init-db.js

3. Start the backend server:

\# Development (auto-reload)  
npm run dev

\# Production  
npm start

*The server runs on http://localhost:5000 by default.*

### **3\. Frontend Setup**

Open a new terminal:  
cd frontend  
npm install  
npm run dev

*The frontend runs on http://localhost:5173.*

## **🔐 Environment Variables**

Create a .env file inside the backend/ folder:  
PORT=5000  
DB\_NAME=crop\_disease\_db  
DB\_USER=postgres  
DB\_PASSWORD=your\_postgres\_password  
DB\_HOST=localhost

*Note: Adjust DB\_USER, DB\_PASSWORD, and DB\_HOST according to your PostgreSQL configuration.*

## **🚀 Running the Application**

1. Make sure **PostgreSQL** is running.  
2. Start backend: cd backend && npm run dev  
3. Start frontend: cd frontend && npm run dev  
4. Open browser to http://localhost:5173

## **📡 API Endpoints**

All endpoints are relative to http://localhost:5000/api.

### **POST /detect**

Upload an image for disease detection.

* **Request:** multipart/form-data with field image (file)  
* **Success Response (200):**

{  
  "id": 42,  
  "label": "Tomato\_Early\_blight",  
  "confidence": 95.62  
}

* **Error Responses:**  
  * 400 – No image uploaded  
  * 500 – Detection failed

### **GET /history**

Retrieve all detection records (most recent first).

* **Response (200):**

\[  
  {  
    "id": 42,  
    "label": "Tomato\_Early\_blight",  
    "confidence": 95.62,  
    "imagePath": "uploads/1711234567890-leaf.jpg",  
    "createdAt": "2025-04-07T10:30:00.000Z",  
    "updatedAt": "2025-04-07T10:30:00.000Z"  
  }  
\]

### **DELETE /history/:id**

Delete a specific detection record.

* **Success Response (200):**

{  
  "message": "Record deleted successfully"  
}

* **Error Responses:**  
  * 404 – Record not found  
  * 500 – Deletion failed

## **📸 Usage Guide**

1. **Upload image:** Click "Choose Image" or drag & drop a leaf photo onto the upload area.  
2. **Use camera:** Click "Open Camera", allow permission, then click "Capture" to take a photo.  
3. **View result:** The predicted disease and confidence percentage appear instantly.  
4. **History:** All detections are saved below. Click the trash icon to delete any record.