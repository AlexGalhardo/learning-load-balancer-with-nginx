import cluster from 'cluster';
import * as os from 'os';
import fs from 'fs';
import path from 'path';
import { generateRandomFullName, generateRandomEmail } from './utils/generate.mjs';

const numWorkers = os.cpus().length;

((folderPath = './responses/post-signup-rest-postgres-api') => {
    fs.readdir(folderPath, (err, files) => {
        if (err) return console.error('Error reading directory: ', err);
        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.unlink(filePath, err => {
                if (err) return console.error('Error deleting file: ', filePath, err);
                console.log('Deleted file: ', filePath);
            });
        });
    });
})()

if (cluster.isPrimary) {
    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for (let i = 0; i < numWorkers; i++) cluster.fork();

    cluster.on('online', (worker) => console.log('Worker ' + worker.process.pid + ' is online'))

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    let workerJobStatistics = {
        worker_id: process.pid,
        worker_execution_time: null,
        total_requests_made: 0,
        total_requests_timeout: 0,
        total_requests_http_status_code_201: 0,
        total_requests_fail: 0,
        responses: []
    };

    const begin = Date.now();

	let total_requests_made = 0

	for (let j = 0; j < 20; j++) {
		total_requests_made++;
		try {
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
				if (response.status === 201) {
					workerJobStatistics.total_requests_made++;
					workerJobStatistics.total_requests_http_status_code_201++;
				}
				return response.json();
			})
			.then(data => {
				console.log(data)
				workerJobStatistics.responses.push({
					endpoint: 'http://localhost/signup',
					response: data
				});
				try {
					fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
				} catch (error) {
					console.log('An error has occurred ', error);
				}
			})
			.catch(error => {
				workerJobStatistics.total_requests_fail++;
				console.error(error);
				try {
					fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
				} catch (error) {
					console.log('An error has occurred ', error);
				}
			});
		}
		catch (error) {
			workerJobStatistics.total_requests_timeout++;
			try {
				fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
			} catch (error) {
				console.log('An error has occurred ', error);
			}
		}
	}

    const end = Date.now();
    const timeSpent = (end - begin) / 1000 + ' seconds';
    console.log(`-------> The Worker ID: ${process.pid} processed total: ${total_requests_made} requests `);

    setTimeout(() => {
		try {
			workerJobStatistics.worker_execution_time = timeSpent;
       	 	fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics, null, 4), 'utf8');
		}
		catch (error) {
			console.log('An error has occurred ', error);
		}
    }, 10000);
}
