// 1. Connect to Supabase (copy the same two values from script.js)
const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_KEY_HERE";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Find the elements we need on the page
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const logoutButton = document.getElementById("logout-button");

// 3. Two helpers that switch which section is visible
function showDashboard() {
  loginSection.hidden = true;
  dashboardSection.hidden = false;
}

function showLogin() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
}

// 4. On page load, check whether someone is already logged in
async function checkSession() {
  const { data } = await db.auth.getSession();

  if (data.session) {
    showDashboard();
  } else {
    showLogin();
  }
}

checkSession();

// 5. Log in when the login form is submitted
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  loginMessage.textContent = "";

  const { error } = await db.auth.signInWithPassword({
    email: loginForm.email.value,
    password: loginForm.password.value
  });

  if (error) {
    console.error(error);
    loginMessage.textContent = "Login failed. Check your email and password.";
    return;
  }

  loginForm.reset();
  showDashboard();
});

// 6. Log out when the logout button is clicked
logoutButton.addEventListener("click", async function () {
  await db.auth.signOut();
  showLogin();
});