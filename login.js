const usersDB = JSON.parse(localStorage.getItem("usersDB")) || [];

function login(event) {
    event.preventDefault();
    
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    const user = usersDB.find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "chatbot.html";
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

function handleGoogleSignIn(response) {
    try {
        const jwt = response.credential;
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const profile = JSON.parse(jsonPayload);
        const googleUser = {
            username: profile.email,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            authProvider: 'google'
        };
        let existingUser = usersDB.find(u => u.email === googleUser.email && u.authProvider === 'google');
        
        if (!existingUser) {
            usersDB.push(googleUser);
            localStorage.setItem("usersDB", JSON.stringify(usersDB));
            existingUser = googleUser;
        }
        localStorage.setItem("currentUser", JSON.stringify(existingUser));
        window.location.href = "chatbot.html";

    } catch (error) {
        console.error('Error processing Google Sign-In:', error);
        document.getElementById("error-message").textContent = "Error signing in with Google. Please try again.";
        document.getElementById("error-message").style.display = "block";
    }
}
