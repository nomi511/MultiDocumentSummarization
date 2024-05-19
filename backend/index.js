const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

let uploadedCsvPath = '';

app.post('/upload', upload.single('file'), (req, res) => {
    uploadedCsvPath = req.file.path;
    const csvData = [];

    fs.createReadStream(uploadedCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            csvData.push(row);
        })
        .on('end', () => {
            res.json({ csvData });
        })
        .on('error', (error) => {
            res.status(500).json({ error: 'Error processing CSV file' });
        });
});

app.post('/summarize', (req, res) => {
    const { numSummaries } = req.body;

    console.log("\n Summarizing...")

    if (!uploadedCsvPath) {
        return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const process = spawn('python3', ['summarize.py', uploadedCsvPath, numSummaries]);

    let result = '';

    process.stdout.on('data', (data) => {
        result += data.toString();
        console.log("\n\nUpdated Result:",result)
    });

    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        if (code !== 0) {
            res.status(500).json({ error: 'Error running Python script' });
            return;
        }
        const results = JSON.parse(result);
        console.log("\n\nFinal Result: ", results)
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
