# **Mindlab App Test**

A lightweight custom Shopify app built with **Express (Node.js)** and **React**, designed to authenticate a merchant with the **Mindlab API**, retrieve their available AI agents, allow selection of one agent, and finally embed a **UMD Chat Widget** into the Shopify storefront.

This project was developed as a technical test and demonstrates:

* Shopify app installation flow
* Secure backend authentication with Mindlab
* Serving a dynamic widget loader through a Shopify ScriptTag / theme snippet
* Rendering a fully integrated AI chat widget inside the storefront
* Frontend UI for selecting AI agents

---

## **1. Project Structure**

```
mindlab-app-test/
└── web/                     # Root directory for the app
    ├── server.js            # Express backend entrypoint
    ├── routes/              # API routes for auth, agents, widget loader
    ├── models/              # Sequelize models
    ├── services/            # Shopify + Mindlab integration services
    ├── frontend/            # React SPA (UI for agent listing & selection)
    │   ├── src/
    │   └── dist/            # Production build
    ├── public/              # Static assets (optional)
    ├── package.json
    ├── demo.mp4             # Demo video of the app in action (add your file here)
    └── README.md
```

---

## **2. Features Overview**

### ✅ **Mindlab Authentication**

Authenticate the Shopify merchant with Mindlab via:

```
POST /api/v1/auth/signin
```

---

### ✅ **AI Agent Management**

Fetch and manage available AI agents.

**Get agents:**

```
GET /api/v1/mindlab/agents/:companyId
```

**Select active agent:**

```
POST /api/v1/mindlab/agents/select
```

---

### ✅ **Dynamic UMD Widget Loader for Shopify Storefront**

The widget is rendered through this dynamically generated script:

```
GET /api/v1/mindlab/widget/widget.js
```

The script:

* Loads React + ReactDOM (UMD)
* Loads the ChatWidget UMD bundle
* Injects required CSS
* Calls:

  ```js
  ChatWidget.init("mindlab-widget-root", widgetConfig);
  ```

This is embedded in Shopify through a theme snippet:

```liquid
<div id="mindlab-widget-root"></div>
<script src="https://DOMAIN/api/v1/mindlab/widget/widget.js" async></script>
```

---

## **3. Installation & Development Setup**

### **Backend**

```bash
cd mindlab-app-test/web
npm install
npm run dev
```

### **Frontend**

```bash
cd mindlab-app-test/web/frontend
npm install
npm run dev
```

---

## **4. Environment Variables**

Create a `.env` file under `/web` with:

```
ENCRYPTION_SECRET
MINDLAB_BASE_URL
APP_BASE_URL
SHOPIFY_API_KEY
SHOPIFY_API_SECRET
SHOPIFY_ADMIN_ACCESS_TOKEN
SHOPIFY_SHOP_DOMAIN
SCOPES
```

⚠️ Never commit `.env` to source control.

---

## **5. Shopify Integration Flow**

### 1️⃣ Install the app in Shopify

The app loads embedded inside Shopify Admin.

### 2️⃣ Sign in with Mindlab

Merchant signs in via `/api/v1/auth/signin`.

### 3️⃣ Select an AI agent

Selected agent is saved through:

```
POST /api/v1/mindlab/agents/select
```

### 4️⃣ Widget loads in storefront

Injected script loads UMD widget and renders it into:

```html
<div id="mindlab-widget-root"></div>
```

---

## **6. API Endpoints Summary**

### **Authentication**

```
POST /api/v1/auth/signin
```

### **AI Agents**

```
GET  /api/v1/mindlab/agents/:companyId
POST /api/v1/mindlab/agents/select
```

### **Storefront Widget**

```
GET /api/v1/mindlab/widget/widget.js
```

---

## **7. Demo Video**

Here you can see an example of the app running in the test store:

🎥 **Demo of the full integration:**

[![Watch the video]](./mindlab-agets-test.mp4)


---

## **8. Technologies Used**

* Node.js + Express (backend)
* React (frontend SPA)
* Sequelize ORM
* Shopify Admin API
* ScriptTag + theme snippet integration
* Dynamic UMD widget injection
* ngrok for tunneling

---

## **9. Notes**

This project is designed as a technical test, demonstrating:

* Clean separation of frontend/backend
* Secure token-based communication with Mindlab
* Dynamic widget loading into Shopify storefront
* Real-world ScriptTag injection patterns

---

## Author

Developed by Jorge Gómez [@jwaldimer](https://github.com/jwaldimer) as part of a technical assessment for MindLab.

---

## **10. License**

This repository is for technical assessment and demonstration purposes only.
