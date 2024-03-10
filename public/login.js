document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get user input values
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Send user input values to the server
    fetch('http://127.0.0.1:8080/api/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Handle response from server
        if (data.message === 'Login successful') {
            // Redirect to the sleeptrack page with user ID as query parameter
            if (data.userId) {
                window.location.href = `http://localhost:8080/sleeptrack?userId=${data.userId}`;
            } else {
                console.error('User ID not found in login response:', data);
            }
        } else {
            // Handle login failure
            console.error('Login failed:', data);
        }
    })
    .catch(error => {
        console.error('Error during Login:', error);
    });
});
