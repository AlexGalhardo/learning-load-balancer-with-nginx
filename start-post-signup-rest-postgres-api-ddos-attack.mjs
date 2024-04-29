import cluster from 'cluster'
import * as os from 'os'
let numWorkers = os.cpus().length;
import fs from 'fs'
import path from 'path'
import { generateRandomFullName, generateRandomEmail } from './utils/generate.mjs'

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

	cluster.on('online', (worker) => console.log('Worker ' + worker.process.pid + ' is online'))

	cluster.on('exit', function (worker, code, signal) {
		console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
		console.log('Starting a new worker');
		cluster.fork();
	});
} else {

	let timetaken = `Execution Time Worker ID:  ${process.pid}`;

	let begin = Date.now();

	console.time(timetaken);

	let totalRequestsMade = 0

	const workerJobStatistics = {
		worker_id: null,
		worker_execution_time: null,
		total_requests_made: 0,
		total_requests_timeout: 0,
		total_requests_http_status_code_200: 0,
		total_requests_fail: 0,
		responses: []
	}

	for (let i = 1; i <= 20; i++) {

		workerJobStatistics.worker_id = process.pid

		const request = {
			endpoint: null,
			response: null
		}

		totalRequestsMade += 1

		workerJobStatistics.total_requests_made += 1

		console.log('Worker ID: ' + process.pid + ` => Processing REQUEST POST: http://localhost/signup`)

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
			.then((response) => {
				console.log('response.status == ', response.status)
					if (response.status === 201) {
						workerJobStatistics.total_requests_http_status_code_200 += 1
						request.status_code = response.status
						request.endpoint = response.url
					}
					return response
				})
			.then(response => response.json())
			.then(response => {
				if (response) request.response = response
				console.log(response)
				workerJobStatistics.responses.push(request)
				try {
					fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
				} catch (error) {
					console.log('An error has occurred ', error);
				}

			})
			.catch(err => {
				workerJobStatistics.total_requests_fail += 1
				console.error(err)
				try {
					fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
				} catch (error) {
					console.error(err)
				}
			})
		} catch (err) {
			workerJobStatistics.total_requests_timeout += 1
			fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
		}
		finally {
			console.timeEnd(timetaken);

			let end = Date.now();

			let timeSpent = (end - begin) / 1000 + " seconds";

			console.log(`-------> The Worker ID: ${process.pid} processed total: ${totalRequestsMade} requests `)

			try {
				const jsonData = JSON.parse(fs.readFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, 'utf-8'));
				jsonData.worker_execution_time = timeSpent
				console.log(`--> Execution Time Worker ID:  ${process.pid} => `, timeSpent)
				fs.writeFileSync(`./responses/post-signup-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(jsonData, null, 4), 'utf8');
			} catch (error) {
				console.log('An error has occurred ', error);
			}
		}
	}
}
