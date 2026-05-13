const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/instructor/attendance',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // We can't easily mock the session token unless we generate one
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Response:", res.statusCode, data);
  });
});

req.on('error', (e) => {
  console.error("Problem with request:", e.message);
});

req.write(JSON.stringify({
  classId: "69e7f979a84dd34177823314",
  date: "2026-05-13",
  subject: "Test",
  records: []
}));
req.end();
