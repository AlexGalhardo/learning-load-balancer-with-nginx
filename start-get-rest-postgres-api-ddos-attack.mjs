import cluster from 'cluster';
import * as os from 'os';
import fs from 'fs';
import path from 'path';

const numWorkers = os.cpus().length;

((folderPath = './responses/get-rest-postgres-api') => {
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
    let workerJobStatistics = {
        worker_id: process.pid,
        worker_execution_time: null,
        total_requests_made: 0,
        total_requests_timeout: 0,
        total_requests_http_status_code_200: 0,
        total_requests_fail: 0,
        responses: []
    };

    const begin = Date.now();

	let total_requests_made = 0

	for (let j = 0; j < 20; j++) {
		total_requests_made++;

		try {
			fetch('http://localhost')
				.then(response => {
					if (response.status === 200) {
						workerJobStatistics.total_requests_made++;
						workerJobStatistics.total_requests_http_status_code_200++;
					}
					return response.json();
				})
				.then(data => {
					console.log(data)
					workerJobStatistics.responses.push({
						endpoint: 'http://localhost',
						response: data
					});
				})
				.catch(error => {
					workerJobStatistics.total_requests_fail++;
					console.error(error);
				});
		}
		catch (error) {
			workerJobStatistics.total_requests_timeout++;
			try {
				fs.writeFileSync(`./responses/get-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics), 'utf8');
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
        	fs.writeFileSync(`./responses/get-rest-postgres-api/responses-from-worker-id-${process.pid}.json`, JSON.stringify(workerJobStatistics, null, 4), 'utf8');
		}
		catch (error) {
			console.log('An error has occurred ', error);
		}
    }, 5000);
}
