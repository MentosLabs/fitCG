// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();
// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// // Serve Static Frontend
// app.use(express.static(path.join(__dirname, 'public')));
// // Health check endpoint
// app.get('/api/health', (req, res) => {
// res.json({ status: 'ok', timestamp: new Date() });
// });
// // VLM Critique API Endpoint
// app.post('/api/critique', async (req, res) => {
// try {
// const { image, angles, exercise } = req.body;
// // Fallback automated heuristic feedback engine
// const kneeAngle = angles?.knee || 180;
// let text = "Maintain good posture. Keep chest upright and weight on your heels.";
// if (kneeAngle < 100) {
// text = "Excellent depth! Your squat angle is optimal (" + kneeAngle + "°). Push through your heels as you rise.";
// } else if (kneeAngle < 135) {
// text = "Good squat attempt (" + kneeAngle + "°). Try lowering slightly further to reach parallel depth.";
// } else {
// text = "Stand tall and initiate the squat by driving hips back. Target knee flexion below 120°.";
// }
// res.json({ ok: true, text, exercise, kneeAngle });
// } catch (error) {
// res.status(500).json({ ok: false, error: error.message });
// }
// });
// // Fallback to main app for client routing
// app.get('*', (req, res) => {
// res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// if (process.env.NODE_ENV !== 'production') {
// app.listen(PORT, () => {
// console.log(Server running on http://localhost:${PORT});
// });
// }
// module.exports = app;
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Critique API
app.post('/api/critique', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        ok: false,
        error: 'Request body is required'
      });
    }

    const { angles, exercise } = req.body;

    const kneeAngle = Number(angles?.knee) || 180;

    let text =
      'Maintain good posture. Keep chest upright and weight on your heels.';

    if (kneeAngle < 100) {
      text = `Excellent depth! Your squat angle is optimal (${kneeAngle}°). Push through your heels as you rise.`;
    } else if (kneeAngle < 135) {
      text = `Good squat attempt (${kneeAngle}°). Try lowering slightly further to reach parallel depth.`;
    } else {
      text =
        'Stand tall and initiate the squat by driving hips back. Target knee flexion below 120°.';
    }

    res.json({
      ok: true,
      text,
      exercise,
      kneeAngle
    });
  } catch (error) {
    console.error('Critique error:', error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;