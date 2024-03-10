// Extract the user ID from the URL
function getUserIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('userId');
}

// Get the user ID from the URL
const userId = getUserIdFromUrl();

// Use the user ID to fetch sleep data for the user
function fetchSleepDataForUser(userId) {
    // Send request to fetch sleep data for the specified user
    const url = `http://127.0.0.1:8080/api/sleep?userId=${userId}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Generate graph of sleep schedule using Chart.js
            generateSleepGraph(data);
        })
        .catch(error => {
            console.error('Error fetching sleep data:', error);
        });
}

// Fetch sleep data for the user
fetchSleepDataForUser(userId);

// Update the sleep table with the retrieved data
// Update the sleep table with the retrieved data
// Update the sleep table with the retrieved data
function updateSleepTable(data) {
    const sleepTableBody = document.querySelector('.sleep-stats tbody');
    // Clear existing table rows
    sleepTableBody.innerHTML = '';

    // Iterate over the sleep data and add rows to the table
    data.forEach(entry => {
        // Format the date to "DD-MM-YYYY"
        const formattedDate = new Date(entry.date).toLocaleDateString('en-GB');
        // Parse sleep and wake-up times
        const sleepTime = parseTime(entry.sleep_time);
        const wakeUpTime = parseTime(entry.wake_up_time);
        // Calculate duration in minutes
        let duration = (wakeUpTime - sleepTime) / (1000 * 60);
        // If wake-up time is before sleep time, add a day to wake-up time
        if (wakeUpTime < sleepTime) {
            wakeUpTime.setDate(wakeUpTime.getDate() + 1);
        }
        // Calculate duration again
        duration = (wakeUpTime - sleepTime) / (1000 * 60);
        const durationHours = Math.floor(duration / 60);
        const durationMinutes = duration % 60;
        // Construct duration string
        const durationString = `${durationHours}hr ${durationMinutes}min`;

        const row = `
            <tr>
                <td>${formattedDate}</td>
                <td>${entry.sleep_time}</td>
                <td>${entry.wake_up_time}</td>
                <td>${durationString}</td>
            </tr>
        `;
        sleepTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Function to parse time strings in railway timing format
function parseTime(timeString) {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);
    return time;
}


// Generate sleep graph with the retrieved data
// Generate sleep graph with the retrieved data
// Generate sleep graph with the retrieved data
// Generate sleep graph with the retrieved data
function generateSleepGraph(data) {
    const dates = data.map(entry => {
        // Format date as "DD-MM-YYYY"
        const dateObj = new Date(entry.date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
        return formattedDate;
    });

    const durations = data.map(entry => {
        // Parse sleep and wake-up times
        const sleepTime = parseTime(entry.sleep_time);
        const wakeUpTime = parseTime(entry.wake_up_time);
        // Calculate duration in minutes
        let duration = (wakeUpTime - sleepTime) / (1000 * 60);
        // If wake-up time is before sleep time, add a day to wake-up time
        if (wakeUpTime < sleepTime) {
            wakeUpTime.setDate(wakeUpTime.getDate() + 1);
            // Calculate duration again
            duration = (wakeUpTime - sleepTime) / (1000 * 60);
        }
        // Convert duration to hours
        duration = duration / 60;
        // Round off duration to two decimal places
        return duration.toFixed(2);
    });

    // Get the canvas element
    const canvas = document.getElementById('sleepChart');

    // Create a new chart instance
    const ctx = canvas.getContext('2d');
    const sleepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Sleep Duration',
                data: durations,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Sleep Duration (hours)'
                    },
                    ticks: {
                        stepSize: 2,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }]
            }
        }
    });
}




document.getElementById('sleepForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get sleep data from the form
    const date = document.getElementById('dateInput').value;
    const sleepTime = document.getElementById('sleepTimeInput').value;
    const wakeUpTime = document.getElementById('wakeUpTimeInput').value;

    // Send sleep data to the backend with user ID in URL parameters
    fetch(`http://127.0.0.1:8080/api/sleep?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify({
            date: date,
            sleepTime: sleepTime,
            wakeUpTime: wakeUpTime
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Handle response from the server
        if (data.error) {
            console.error('Error storing sleep data:', data.error);
        } else {
            // Update the sleep table and graph with the updated data
            updateSleepTable(data);
            generateSleepGraph(data);
        }
    })

});
