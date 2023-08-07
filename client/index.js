

// JavaScript
window.addEventListener("load", checkLogin);

function checkLogin() {
  const loginStatus = JSON.parse(localStorage.getItem("login"));
  const logoutButton = document.querySelector(".logout");
  const loginButton = document.querySelector(".login");
  const signupButton = document.querySelector(".signup");

  if (loginStatus === true) {
    // User is logged in, show logout button and hide login and signup buttons
    logoutButton.style.display = "inline-block";
    loginButton.style.display = "none";
    signupButton.style.display = "none";
  } else {
    // User is not logged in, show login and signup buttons and hide logout button
    logoutButton.style.display = "none";
    loginButton.style.display = "inline-block";
    signupButton.style.display = "inline-block";
  }
}

const handleSearch = async () => {
  const toastDisplay = document.getElementById("toast");
  const searchInput = document.getElementById("searchInput");
  const value = searchInput.value;
  const posterSrc = document.getElementsByClassName("movie-poster");
  const title = document.getElementsByClassName("title")[0];
  const year = document.getElementsByClassName("year")[0];
  const release = document.getElementsByClassName("release")[0];
  const genre = document.getElementsByClassName("genre")[0];
  const rating = document.getElementsByClassName("rating")[0];
  const movieContainer = document.getElementsByClassName("movie-container")[0];

  if (value) {
    try {
      toastDisplay.style.display = "block";
      const response = await fetch("http://localhost:5000/movie", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieName: value }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toastDisplay.style.display = "none";
        searchInput.value = "";
        movieContainer.style.display = "flex";
        for (const poster of posterSrc) {
          poster.setAttribute("src", data.Poster);
        }
        title.textContent = `Title: ${data.Title}`;
        year.textContent = `Year: ${data.Year}`;
        release.textContent = `Release: ${data.Released}`;
        genre.textContent = `Genre: ${data.Genre}`;
        rating.textContent = `IMDB: ${data.imdbRating}`;
      } else {
        setTimeout(() => {
          toastDisplay.style.display = "none";
        }, 3000);
        console.error("Request failed with status:", response.status);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }
};
const handlePublicPlaylist = () => {
  const movieData = {
    title: document.querySelector(".title").textContent,
    year: document.querySelector(".year").textContent,
    release: document.querySelector(".release").textContent,
    genre: document.querySelector(".genre").textContent,
    rating: document.querySelector(".rating").textContent,
    poster: document.querySelector(".movie-poster").getAttribute("src"),
  };

  // Get the existing playlist from local storage or create an empty array
  const publicPlaylist =
    JSON.parse(localStorage.getItem("publicPlaylist")) || [];

  // Check if the movie with the same title already exists in the playlist
  const isDuplicate = publicPlaylist.some(
    (item) => item.title === movieData.title
  );
  if (!isDuplicate && movieData.title !== "Title") {
    publicPlaylist.push(movieData);
    localStorage.setItem("publicPlaylist", JSON.stringify(publicPlaylist));
    console.log("Movie added to public playlist!");
  }else if(movieData.title==="Title"){
    console.log("Please search A movie to add")
  } 
  else {
    console.log("Movie already exists in the public playlist!");
  }
};

const handleViewPublicPlaylist = () => {
  const publicPlaylist =
    JSON.parse(localStorage.getItem("publicPlaylist")) || [];
  console.log(publicPlaylist);
};

document
  .querySelector(".playlist button:first-child")
  .addEventListener("click", handlePublicPlaylist);
document
  .querySelector(".playlist button:last-child")
  .addEventListener("click", handleViewPublicPlaylist);

async function handleLogin() {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log("Username:", username);
  console.log("Password:", password);

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.message === "User exists") {
        localStorage.setItem("login", JSON.stringify(true));
        window.location.href = "/client/index.html";
        checkLogin();
      } else {
        window.location.href = "/client/signup.html";
      }
    } else {
      console.log("login failed");
    }
  } catch (err) {
    console.log(err);
  }
}
async function handleSignUp() {
  event.preventDefault();


  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;


  const userData = {
    email,
    username,
    password,
  };
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  try {
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), 
    });

    if (response.ok) {
      const data = await response.json();
      if (data === "User Added success") {
        localStorage.setItem("login", JSON.stringify(true));
        window.location.href = "/client/index.html";
      }
    } else {
      console.log("Signup failed");
    }
  } catch (err) {
    console.log("Error:", err); 
  }
}

function handleLogout() {
  try {
    localStorage.removeItem("login");
    const logoutButton = document.querySelector(".logout");
    const loginButton = document.querySelector(".login");
    const signupButton = document.querySelector(".signup");
    logoutButton.style.display = "none";
    loginButton.style.display = "inline-block";
    signupButton.style.display = "inline-block";
  } catch (err) {
    console.log(err);
  }
};
