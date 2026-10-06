const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const {
  User,
  Profile,
  WeightLog,
  Food,
  Meal,
  Exercise,
  Workout,
  RunningLog,
  WalkingLog,
  WaterLog,
  SleepLog,
  Goal,
} = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fittrack_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Root route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitTrack API Server Running' });
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Default Profile
    const profile = new Profile({ userId: user._id.toString(), fullName: name });
    await profile.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PROFILE ROUTES
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new Profile({ userId: req.user.id });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, upsert: true });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// WEIGHT LOGS
app.get('/api/weight', authMiddleware, async (req, res) => {
  try {
    const logs = await WeightLog.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/weight', authMiddleware, async (req, res) => {
  try {
    const log = new WeightLog({ ...req.body, userId: req.user.id });
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/weight/:id', authMiddleware, async (req, res) => {
  try {
    await WeightLog.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MEALS
app.get('/api/meals', authMiddleware, async (req, res) => {
  try {
    const query = { userId: req.user.id };
    if (req.query.date) query.date = req.query.date;
    const meals = await Meal.find(query);
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/meals', authMiddleware, async (req, res) => {
  try {
    const meal = new Meal({ ...req.body, userId: req.user.id });
    await meal.save();
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/meals/:id', authMiddleware, async (req, res) => {
  try {
    await Meal.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EXERCISES
app.get('/api/exercises', authMiddleware, async (req, res) => {
  try {
    const query = { userId: req.user.id };
    if (req.query.date) query.date = req.query.date;
    const exercises = await Exercise.find(query);
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/exercises', authMiddleware, async (req, res) => {
  try {
    const exercise = new Exercise({ ...req.body, userId: req.user.id });
    await exercise.save();
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GOALS
app.get('/api/goals', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/goals', authMiddleware, async (req, res) => {
  try {
    const goal = new Goal({ ...req.body, userId: req.user.id });
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`FitTrack Backend Server listening on port ${PORT}`);
});
