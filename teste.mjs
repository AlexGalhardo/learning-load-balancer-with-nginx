function generateRandomFullName() {
    const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'James', 'Olivia', 'William', 'Ava', 'Alexander', 'Isabella', 'Benjamin', 'Mia', 'Jacob', 'Charlotte', 'Ethan', 'Amelia', 'Daniel', 'Harper', 'Matthew', 'Evelyn'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];

    const randomFirstNameIndex = Math.floor(Math.random() * firstNames.length);
    const randomLastNameIndex = Math.floor(Math.random() * lastNames.length);

    const firstName = firstNames[randomFirstNameIndex];
    const lastName = lastNames[randomLastNameIndex];

    return `${firstName} ${lastName}`;
  }

  const generateRandomEmail = () => {
      const randomString = Math.random().toString(36).substring(2, 12);
      return `${randomString}@example.com`;
  };

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
						console.log(response)
						return response
					})
					.then(response => response.json())
					.then(response => {
						return response
					})
					.then(response => {
						console.log(response)
					})
					.catch(err => {
						console.error(err)
					})
			} catch (err) {
				console.log(err)
			}