import app from './app.js';
import { PORT } from './config/env.js';     

const server = app.listen(PORT, () => {
  console.log(`Zed Movies is running on http://localhost:${PORT}`);
});

