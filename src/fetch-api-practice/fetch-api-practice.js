async function loadUsers() {
  try {
    console.log('Fetching users from API...');
    const response = await fetch(
      'https://jsonplaceholder.typicode.invalid/users'
    );

    console.log('HTTP status', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const users = await response.json();

    console.log('Users received: ', users);
    console.log('Number of users: ', users.length);
  } catch (error) {
    console.error('ERROR: ', error.message);
  } finally {
    console.log('User request completed');
  }
}

loadUsers();
