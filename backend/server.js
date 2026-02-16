// backend/server.js - FIXED VERSION WITH CLEAR PROMPT
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('\n❌ No API key found!');
    process.exit(1);
}

// Models from your account
const AVAILABLE_MODELS = [
    "models/gemini-2.5-flash",
    "models/gemini-2.5-pro",
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-001",
    "models/gemini-2.0-flash-lite-001",
    "models/gemini-2.0-flash-lite",
    "models/gemini-2.5-flash-lite"
];

console.log('\n✅ API Key loaded successfully');
console.log('📋 Available models from your account:');
AVAILABLE_MODELS.forEach(m => console.log(`   - ${m}`));

// ============================================
// Generate using REST API
// ============================================
async function generateWithREST(prompt) {
    for (const model of AVAILABLE_MODELS) {
        try {
            console.log(`   🔄 Trying ${model}...`);

            const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${API_KEY}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4096,
                        topP: 0.8,
                        topK: 40
                    }
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                const text = data.candidates[0].content.parts[0].text;
                console.log(`   ✅ Success with: ${model}`);
                return { success: true, text, model };
            } else if (data.error) {
                console.log(`   ❌ ${model}: ${data.error.message}`);
            }
        } catch (error) {
            console.log(`   ❌ ${model}: Network error`);
        }
    }

    return { success: false, error: 'All models failed' };
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        apiKey: '✅ present',
        availableModels: AVAILABLE_MODELS,
        timestamp: new Date().toISOString()
    });
});

// Mock data endpoint for testing UI
app.get('/api/mock-tests', (req, res) => {
    const mockTests = `1. Verify successful login with valid credentials
   Preconditions: User account exists with email "test@example.com" and password "Test@123"
   Steps:
   1. Navigate to the login page
   2. Enter "test@example.com" in the email field
   3. Enter "Test@123" in the password field
   4. Click the "Sign In" button
   Expected Result: User is redirected to the dashboard and sees a welcome message

2. Verify login fails with incorrect password
   Preconditions: User account exists with email "test@example.com"
   Steps:
   1. Navigate to login page
   2. Enter "test@example.com" in email field
   3. Enter "WrongPassword123" in password field
   4. Click "Sign In" button
   Expected Result: Error message "Invalid email or password" is displayed, user remains on login page

3. Verify login fails with non-existent username
   Steps:
   1. Navigate to login page
   2. Enter "nonexistent@example.com" in email field
   3. Enter "password123" in password field
   4. Click "Sign In" button
   Expected Result: Error message "User not found" or "Invalid credentials" is displayed

4. Verify all fields are required
   Steps:
   1. Navigate to login page
   2. Leave email field empty
   3. Leave password field empty
   4. Click "Sign In" button
   Expected Result: Form is not submitted, validation messages indicate both fields are required

5. Verify password field masks input
   Steps:
   1. Navigate to login page
   2. Type "password123" in the password field
   Expected Result: Characters appear as bullets or dots, not plain text

6. Verify "Remember Me" functionality
   Preconditions: User account exists
   Steps:
   1. Navigate to login page
   2. Enter valid credentials
   3. Check the "Remember Me" checkbox
   4. Click "Sign In"
   5. Close and reopen browser
   6. Navigate to protected page
   Expected Result: User remains logged in or session is restored

7. Verify Forgot Password link navigates correctly
   Steps:
   1. Navigate to login page
   2. Click "Forgot Password" link
   Expected Result: User is redirected to password reset page

8. Verify login button state when fields are empty
   Steps:
   1. Navigate to login page
   2. Keep both email and password fields empty
   Expected Result: Login button is disabled or greyed out

9. Verify error message disappears when typing
   Steps:
   1. Enter invalid credentials and trigger error message
   2. After error appears, start typing in the email field
   Expected Result: Error message disappears or clears

10. Verify session timeout
    Preconditions: User is logged in
    Steps:
    1. Log in successfully
    2. Wait for 30 minutes without any activity
    3. Try to access a protected page
    Expected Result: User is redirected to login page with "Session expired" message`;

    res.json({
        success: true,
        testCases: mockTests,
        feature: req.query.feature || "Login page functionality",
        note: "Mock data for testing"
    });
});

// MAIN ENDPOINT - Generate test cases for the USER'S feature
app.post('/api/generate-tests', async (req, res) => {
    try {
        const { featureDescription } = req.body;

        if (!featureDescription) {
            return res.status(400).json({ error: 'Feature description is required' });
        }

        console.log('\n📝 ==================================');
        console.log(`📝 Generating tests for: "${featureDescription.substring(0, 50)}..."`);
        console.log('📝 ==================================\n');

        // CRYSTAL CLEAR PROMPT - Explicitly tells AI what to do
        const prompt = `You are a QA engineer. Generate 10 detailed test cases for the following feature:

FEATURE TO TEST: "${featureDescription}"

IMPORTANT: These test cases should be FOR TESTING the feature described above. Do NOT create test cases about generating test cases.

For each test case, provide:
1. Test Case Title (clear and descriptive)
2. Preconditions (what needs to be set up before testing)
3. Test Steps (numbered list of actions to perform)
4. Expected Result (what should happen after steps)

Format each test case exactly like this example:

1. [TITLE]
   Preconditions: [setup requirements]
   Steps:
   1. [first step]
   2. [second step]
   3. [third step]
   Expected Result: [what should happen]

Cover these categories:
- 3 Positive test cases (happy path scenarios)
- 3 Negative test cases (error handling, invalid inputs)
- 2 Edge cases (boundary conditions, unusual scenarios)
- 1 UI/UX test (visual and interaction testing)
- 1 Security/Performance test

Generate test cases ONLY for: ${featureDescription}

TEST CASES:`;

        // Try REST API with your available models
        const result = await generateWithREST(prompt);

        if (!result.success) {
            throw new Error('All models failed to generate tests');
        }

        // Get the raw test cases
        let testCases = result.text;

        // Ensure we have proper formatting
        if (!testCases.match(/^\d+\./m)) {
            // If not numbered, try to format it
            testCases = testCases
                .split('\n')
                .filter(line => line.trim())
                .map((line, index) => `${index + 1}. ${line}`)
                .join('\n');
        }

        console.log(`\n✅ Successfully generated test cases`);
        console.log(`   Using model: ${result.model}`);
        console.log(`   Response length: ${testCases.length} characters`);

        res.json({
            success: true,
            testCases: testCases,
            feature: featureDescription,
            model: result.model,
            count: (testCases.match(/^\d+\./gm) || []).length || 'unknown'
        });

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        res.status(500).json({
            error: 'Failed to generate test cases',
            details: error.message
        });
    }
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Server is running!',
        models: AVAILABLE_MODELS
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 ==================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('🚀 ==================================\n');
    console.log('📌 Available endpoints:');
    console.log('   ✅ POST /api/generate-tests - Generate AI tests');
    console.log('   ✅ GET  /api/mock-tests    - Get mock tests (for UI testing)');
    console.log('   ✅ GET  /api/health         - Health check');
    console.log('   ✅ GET  /api/test           - Simple test\n');
});
