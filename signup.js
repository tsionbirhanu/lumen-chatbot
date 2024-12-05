const usersDB = JSON.parse(localStorage.getItem("usersDB")) || [];

function signup(event) {
    event.preventDefault();
    
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }
    

    if (usersDB.some(user => user.username === username)) {
        alert("Username already taken. Please choose another one.");
        return;
    }
    
    const newUser = { username, password, chatHistory: [] };
    usersDB.push(newUser);
    localStorage.setItem("usersDB", JSON.stringify(usersDB));

    alert("Account created successfully! You can now log in.");
    window.location.href = "login.html"; 
}
