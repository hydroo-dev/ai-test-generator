# AI Test Case Generator

An intelligent web app that generates detailed test cases for any feature using Google's Gemini AI. Just describe what you want to test, and get comprehensive test cases with steps, preconditions, and expected results.


![Demo](screencapture-localhost-3000-2026-02-16-23_31_51.png)
![Demo](screencapture-localhost-3000-2026-02-16-23_32_45.png)

## ✨ Features

- **AI-Powered**: Uses Google Gemini 2.5 Flash to generate smart test cases
- **Detailed Output**: Each test case includes title, preconditions, step-by-step instructions, and expected results
- **Playwright Ready**: Generate ready-to-use Playwright test scripts with one click
- **Clean UI**: Modern, responsive design that works on all devices
- **Copy Code**: One-click copy for generated Playwright tests
- **Mock Mode**: Test the UI without consuming API quota

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (no frameworks)
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **Testing**: Playwright (for generated code)
- **Deployment**: Vercel (free tier)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm
- Google AI Studio API key ([get it here](https://aistudio.google.com/app/apikey))

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/ai-test-generator.git
cd ai-test-generator
npm install
```

### 2. Get API Key

- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Click "Create API Key"
- Copy the key

### 3. Configure

Create a `.env` file in root folder:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### 4. Run
```bash
npm run dev
```

### 5. Open browser
```text
http://localhost:3000
```

## 📁 Project Structure
```text
ai-test-generator/
├── backend/
│   └── server.js           # Express server + Gemini API
├── public/
│   └── index.html          # Frontend UI
├── .env                    # Your API key (don't commit this!)
├── package.json            # Dependencies
└── README.md               # This file
```

## 🎯 How to Use

1. **Describe your feature** in the text box
   ```text
   Example: "Login page with email, password, remember me, and submit button"
   ```

2. **Click "Generate Test Cases"**

3. **Wait 15-20 seconds** for AI to generate

4. **View beautifully formatted test cases** with color-coded categories:
   - 🟢 **POSITIVE** - Happy path scenarios
   - 🔴 **NEGATIVE** - Error cases
   - 🟡 **EDGE** - Boundary conditions
   - 🔵 **UI/UX** - Interface tests
   - 🟣 **PERFORMANCE** - Load tests

5. **Click "Generate Playwright Code"** on any test case to get automation code

6. **Click "Copy"** to copy the code to clipboard

## 🎭 Example

**Input:**
```text
"A shopping cart with add/remove items and apply discount"
```

**Output:**
```text
1. **[POSITIVE] Add item to cart**
   Preconditions: User logged in, item in stock
   Steps:
   1. Go to product page
   2. Click "Add to Cart"
   3. Open cart
   Expected Result: Item appears with correct quantity and price

2. **[NEGATIVE] Apply invalid discount code**
   Preconditions: Cart has items
   Steps:
   1. Go to cart page
   2. Enter "INVALID123" in discount field
   3. Click "Apply"
   Expected Result: Error message "Invalid discount code"
```