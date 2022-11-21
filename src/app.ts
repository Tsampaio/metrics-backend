import express from 'express';
import promMid from 'express-prometheus-middleware';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(
  promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    authenticate: (req) => req.headers.authorization === 'Basic mysecrettoken',
  }),
);

app.get('/time', (req, res) => {
  const epoch = Math.round(Date.now() / 1000);

  res.status(200).json({ time: epoch });
});

app.get('/metrics', (req, res) => {
  res.status(403).json({ message: `Not authorizated` });
});

export default app;
