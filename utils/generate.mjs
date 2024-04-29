export function generateRandomFullName() {
    const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'James', 'Olivia', 'William', 'Ava', 'Alexander', 'Isabella', 'Benjamin', 'Mia', 'Jacob', 'Charlotte', 'Ethan', 'Amelia', 'Daniel', 'Harper', 'Matthew', 'Evelyn'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];

    const randomFirstNameIndex = Math.floor(Math.random() * firstNames.length);
    const randomLastNameIndex = Math.floor(Math.random() * lastNames.length);

    const firstName = firstNames[randomFirstNameIndex];
    const lastName = lastNames[randomLastNameIndex];

    return `${firstName} ${lastName}`;
  }

  export const generateRandomEmail = () => {
      const randomString = Math.random().toString(36).substring(2, 12);
      return `${randomString}@example.com`;
  };