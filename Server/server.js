const express = require('express');
const cors = require('cors'); // Needed for frontend to be able to make requests to the server.
const cookieParser = require('cookie-parser'); // Needed for cookies
const jwt = require('jsonwebtoken'); // Also needed for cookies
// Routes for querrying the DB: 
const testRoutes = require('./routes/test');
const addUserRoutes = require('./routes/addUser');
const loginUserRoutes = require('./routes/loginUser');

const app = express();
const port = 3000; 

app.use(express.json());
app.use(cookieParser());
// Configure CORS to allow requests from your frontend origin
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Your frontend URL
  methods: ['GET', 'POST'],
  credentials: true // Allow credentials (cookies)
}));

const secretKey = 'F4#k_C_~[0o7J+`OP5UpNCO%h;9[1ztz'; 

// User defined routes:
app.use(testRoutes);
app.use(addUserRoutes(secretKey));
app.use(loginUserRoutes(secretKey));

app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(403).send('Forbidden');
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    next();
  }
});

// Middleware to check if the user is authenticated:
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

// Test route:
app.get('/protected', isAuthenticated, (req, res) => {
  res.send('This is a protected route');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
