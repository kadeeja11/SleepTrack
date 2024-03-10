document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get user input values
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Send user input values to the server
    fetch('http://127.0.0.1:8080/api/signup', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json',
            // Add CORS headers here if needed
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Handle response from server
        if (data.message === 'Signup successful') {
            // Redirect to the page specified by the server
            window.location.href = `http://localhost:8080/sleeptrack?userId=${data.userId}`;
        } else {
            // Handle signup failure
            console.error('Signup failed:', data);
        }
    })
    .catch(error => {
        console.error('Error during signup:', error);
    });
});
