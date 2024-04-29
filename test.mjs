import cluster from 'cluster';
import * as os from 'os';
import fs from 'fs';
import path from 'path';
import { generateRandomFullName, generateRandomEmail } from './utils/generate.mjs';

const numWorkers = os.cpus().length;

((folderPath = './responses/post-signup-rest-postgres-api') => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error('Error deleting file:', filePath, err);
                } else {
                    console.log('Deleted file:', filePath);
                }
            });
        });
    });
})()

if (cluster.isPrimary) {
    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for (let i = 0; i < numWorkers; i++) cluster.fork();

    cluster.on('online', (worker) => console.log('Worker ' + worker.process.pid + ' is online'));

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    const workerJobStatistics = {
        worker_id: process.pid,
        worker_execution_time: null,
        total_requests_made: 0,
        total_requests_timeout: 0,
        total_requests_http_status_code_200: 0,
        total_requests_fail: 0,
        responses: []
    };

    const timetaken = `Execution Time Worker ID: ${process.pid}`;
    console.time(timetaken);

    const begin = Date.now();

    const requests = [];

    for (let i = 1; i <= 20; i++) {
        requests.push(
            fetch(`http://localhost/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: generateRandomFullName(),
                    email: generateRandomEmail(),
                    password: 'randompassword@BR123'
                })
            })
            .then(response => {
                workerJobStatistics.total_requests_made += 1;
                console.log('Worker ID: ' + process.pid + ' => Processing REQUEST POST: http://localhost/signup');
                if (response.status === 201) {
                    workerJobStatistics.total_requests_http_status_code_200 += 1;
                    const request = {
                        endpoint: response.url,
                        response: null
                    };
                    return response.json().then(data => {
                        request.response = data;
                        workerJobStatistics.responses.push(request);
                        try {
                            fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
                        } catch (error) {
                            console.error('An error has occurred ', error);
                        }
                    });
                } else {
                    workerJobStatistics.total_requests_fail += 1;
                }
            })
            .catch(err => {
                workerJobStatistics.total_requests_timeout += 1;
                console.error(err);
                try {
                    fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
                } catch (error) {
                    console.error(error);
                }
            })
        );
    }

    Promise.all(requests)
        .then(() => {
            console.timeEnd(timetaken);
            const end = Date.now();
            const timeSpent = (end - begin) / 1000 + ' seconds';
            console.log(`-------> The Worker ID: ${process.pid} processed total: ${workerJobStatistics.total_requests_made} requests `);
            try {
                workerJobStatistics.worker_execution_time = timeSpent;
                console.log(`--> Execution Time Worker ID: ${process.pid} => `, timeSpent);
                fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics, null, 4), 'utf8');
            } catch (error) {
                console.error('An error has occurred ', error);
            }
        });
}
