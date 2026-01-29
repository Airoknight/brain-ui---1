const API_URL = 'http://localhost:3000/api';

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
    }

    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });

    // Refresh data based on section
    if (sectionId === 'dashboard' || sectionId === 'students' || sectionId === 'alerts') {
        fetchStudents();
    }
    if (sectionId === 'food') {
        fetchFoodLogs();
    }
    if (sectionId === 'dashboard') {
        fetchFoodLogs(true); // Update dashboard stats only
    }
}

// Modal Handling
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Data Fetching and UI Updates
async function fetchStudents() {
    try {
        const res = await fetch(`${API_URL}/students`);
        const students = await res.json();

        updateDashboardStats(students);
        renderStudentsTable(students);
        updateAlertRecipients(students);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

async function fetchFoodLogs(statsOnly = false) {
    try {
        const res = await fetch(`${API_URL}/cancellations`);
        const logs = await res.json();

        if (statsOnly) {
            // Filter logs for today
            const today = new Date().toLocaleDateString();
            const todayLogs = logs.filter(log => {
                const logDate = new Date(log.time).toLocaleDateString();
                return logDate === today; // Simple date match
            });
            document.getElementById('today-cancellations').textContent = todayLogs.length;
        } else {
            renderFoodLogsTable(logs);
        }
    } catch (error) {
        console.error('Error fetching food logs:', error);
    }
}

function updateDashboardStats(students) {
    document.getElementById('total-students').textContent = students.length;

    const totalPending = students.reduce((sum, s) => {
        return s.feeStatus === 'Pending' ? sum + Number(s.feeAmount) : sum;
    }, 0);

    document.getElementById('total-pending').textContent = totalPending;
}

function renderStudentsTable(students) {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';

    students.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.name}</td>
            <td>${s.room}</td>
            <td><span class="tag ${s.feeStatus.toLowerCase()}">${s.feeStatus}</span></td>
            <td>₹${s.feeAmount}</td>
            <td>${s.chatId || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateAlertRecipients(students) {
    const selector = document.getElementById('alert-recipient');
    // Keep the "All" option
    selector.innerHTML = '<option value="all">All Students with Pending Fees</option>';

    students.forEach(s => {
        if (s.feeStatus === 'Pending') {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = `${s.name} (Room ${s.room})`;
            selector.appendChild(option);
        }
    });
}

function renderFoodLogsTable(logs) {
    const tbody = document.getElementById('food-table-body');
    tbody.innerHTML = '';

    // Show newest first
    logs.reverse().forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.name}</td>
            <td>${log.time}</td>
            <td>${log.chatId}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Form Handlers
document.getElementById('add-student-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const student = {
        name: document.getElementById('s-name').value,
        room: document.getElementById('s-room').value,
        chatId: document.getElementById('s-chatid').value,
        feeStatus: document.getElementById('s-status').value,
        feeAmount: document.getElementById('s-amount').value
    };

    try {
        const res = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        if (res.ok) {
            closeModal('addStudentModal');
            document.getElementById('add-student-form').reset();
            fetchStudents();
            alert('Student added successfully!');
        } else {
            alert('Failed to add student');
        }
    } catch (error) {
        console.error('Error adding student:', error);
    }
});

async function sendFeeAlert() {
    const studentId = document.getElementById('alert-recipient').value;
    const message = document.getElementById('alert-message').value;

    if (!message) return alert('Please enter a message');

    try {
        const res = await fetch(`${API_URL}/send-alert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, message })
        });

        const data = await res.json();
        if (data.success) {
            alert(data.message);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error sending alert:', error);
        alert('Failed to send alert');
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();
    fetchFoodLogs(true);
});
