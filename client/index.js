// JavaScript
window.addEventListener("load", checkLogin);
function showLoadingSpinner() {
  const toastDisplay = document.getElementById("toast");
  toastDisplay.style.display = "block";
}

function hideLoadingSpinner() {
  const toastDisplay = document.getElementById("toast");
  toastDisplay.style.display = "none";
}

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
  const movieListContainer = document.querySelector(".movie-list");
  if (value) {
    try {
      toastDisplay.style.display = "block";
      movieListContainer.style.display = "none";
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
const handlePublicPlaylist = async () => {
  const movieData = {
    userId: "public123",
    title: document.querySelector(".title").textContent,
    genre: document.querySelector(".genre").textContent,
    year: document.querySelector(".year").textContent,
    release: document.querySelector(".release").textContent,
    rating: document.querySelector(".rating").textContent,
    poster: document.querySelector(".movie-poster").getAttribute("src"),
    type: "public",
  };
  showLoadingSpinner();
  const response = await fetch("http://localhost:5000/publicplaylist", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  });
  if (response.ok) {
    const data = await response.json();
    hideLoadingSpinner();
    console.log(data);
  }
};

const handlePrivatePlaylist = async () => {
  const userData = await JSON.parse(localStorage.getItem("userData"));

  if (userData) {
    showLoadingSpinner();
    const userId = userData._id;
    const movieData = {
      userId: userId,
      title: document.querySelector(".title").textContent,
      genre: document.querySelector(".genre").textContent,
      year: document.querySelector(".year").textContent,
      release: document.querySelector(".release").textContent,
      rating: document.querySelector(".rating").textContent,
      poster: document.querySelector(".movie-poster").getAttribute("src"),
      type: "private",
    };
    // Send a post request to the backend for storing the public playlist
    const response = await fetch("http://localhost:5000/privateplaylist", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });
    if (response.ok) {
      const data = await response.json();
      hideLoadingSpinner();
      const addMessage = document.getElementById("add-message");
      if (data.message === "Movie already exists in Private") {
        addMessage.style.display = "flex";
        addMessage.textContent = data.message;
        addMessage.style.backgroundColor = "#F3AA60";
        addMessage.style.color = "white";
      }
      addMessage.style.display = "flex";
      addMessage.textContent = data.message;
      setTimeout(() => {
        addMessage.style.display = "none";
      }, 2000);
    }
  } else {
    window.location.href = "/client/login.html";
  }
};

const handleViewPublicPlaylist = async () => {
  const movieListContainer = document.querySelector(".movie-list");
  movieListContainer.style.display = "flex";
  movieListContainer.innerHTML = "";
  showLoadingSpinner();
  const response = await fetch("http://localhost:5000/viewpublic", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    hideLoadingSpinner();
    console.log(data);
    data.forEach((movie) => {
      const movieContainer = document.createElement("div");
      movieContainer.className = "movie-container";
      movieContainer.style.display = "flex";
      const poster = document.createElement("img");
      poster.className = "movie-poster";
      poster.setAttribute("src", movie.poster);
      poster.style.display = "inline";
      movieContainer.appendChild(poster);

      const description = document.createElement("div");
      description.className = "movie-description";

      const title = document.createElement("span");
      title.className = "title";
      title.textContent = `${movie.title}`;
      description.appendChild(title);

      const year = document.createElement("span");
      year.className = "year";
      year.textContent = `${movie.year}`;
      description.appendChild(year);

      const release = document.createElement("span");
      release.className = "release";
      release.textContent = `Release: ${movie.release}`;
      description.appendChild(release);

      const genre = document.createElement("span");
      genre.className = "genre";
      genre.textContent = `Genre: ${movie.genre}`;
      description.appendChild(genre);

      const rating = document.createElement("span");
      rating.className = "rating";
      rating.textContent = `IMDB: ${movie.rating}`;
      description.appendChild(rating);
      movieContainer.appendChild(description);
      movieListContainer.appendChild(movieContainer);
    });
  } else {
    console.log("Error while getting the data");
  }
};

const handleViewPrivatePlaylist = async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    const userId = userData._id;
    showLoadingSpinner();
    const response = await fetch("http://localhost:5000/viewprivate", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId }),
    });
    if (response.ok) {
      const data = await response.json();
      hideLoadingSpinner();
      const movieListContainer = document.querySelector(".movie-list");
      movieListContainer.style.display = "flex";
      movieListContainer.innerHTML = "";

      data.forEach((movie) => {
        const movieContainer = document.createElement("div");
        movieContainer.className = "movie-container";
        movieContainer.style.display = "flex";
        const poster = document.createElement("img");
        poster.className = "movie-poster";
        poster.setAttribute("src", movie.poster);
        movieContainer.appendChild(poster);

        const description = document.createElement("div");
        description.className = "movie-description";

        const title = document.createElement("span");
        title.className = "title";
        title.textContent = `Title: ${movie.title}`;
        description.appendChild(title);

        const year = document.createElement("span");
        year.className = "year";
        year.textContent = `Year: ${movie.year}`;
        description.appendChild(year);

        const release = document.createElement("span");
        release.className = "release";
        release.textContent = `Release: ${movie.release}`;
        description.appendChild(release);

        const genre = document.createElement("span");
        genre.className = "genre";
        genre.textContent = `Genre: ${movie.genre}`;
        description.appendChild(genre);

        const rating = document.createElement("span");
        rating.className = "rating";
        rating.textContent = `IMDB: ${movie.rating}`;
        description.appendChild(rating);
        movieContainer.appendChild(description);
        movieListContainer.appendChild(movieContainer);
      });
    } else {
      console.log("Error while getting the data");
    }
  } else {
    window.location.href = "/client/login.html";
  }
};

document
  .querySelector(".playlist button:first-child")
  .addEventListener("click", handlePublicPlaylist);
document
  .querySelector(".playlist button:last-child")
  .addEventListener("click", handleViewPublicPlaylist);
document
  .getElementById("view-private")
  .addEventListener("click", handleViewPrivatePlaylist);

  async function handleLogin() {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    showLoadingSpinner();
    clearInputFields();
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.message !== "User not exists") {
          localStorage.setItem("login", JSON.stringify(true));
          localStorage.setItem("userData", JSON.stringify(data));
          window.location.href = "/client/index.html";
        } else {
          handleLoginError("User not exists");
        }
        hideLoadingSpinner();
        checkLogin();
      } else {
        console.log("Login failed");
        handleLoginError("Login Failed");
        hideLoadingSpinner();
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  function handleLoginError(message) {
    const addMessage = document.getElementById("add-message");
    hideLoadingSpinner();
    addMessage.style.display = "flex";
    addMessage.textContent = message;
    addMessage.style.backgroundColor = "#F3AA60";
    addMessage.style.color = "white";
    setTimeout(() => {
      addMessage.style.display = "none";
    }, 2000);
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

  showLoadingSpinner();
  clearInputFields();

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
      if (data) {
        hideLoadingSpinner();
        localStorage.setItem("login", JSON.stringify(true));
        localStorage.setItem("userData", JSON.stringify(data));
        window.location.href = "/client/index.html";
      }
    } else {
      handleSignUpError();
    }
  } catch (err) {
    console.log("Error:", err);
  }
}

function clearInputFields() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function handleSignUpError() {
  const addMessage = document.getElementById("add-message");
  hideLoadingSpinner();
  addMessage.style.display = "flex";
  addMessage.textContent = "Sign Up Failed";
  addMessage.style.backgroundColor = "#F3AA60";
  addMessage.style.color = "white";
  setTimeout(() => {
    addMessage.style.display = "none";
  }, 2000);
}

function handleLogout() {
  try {
    localStorage.removeItem("login");
    localStorage.removeItem("userData");
    const logoutButton = document.querySelector(".logout");
    const loginButton = document.querySelector(".login");
    const signupButton = document.querySelector(".signup");
    logoutButton.style.display = "none";
    loginButton.style.display = "inline-block";
    signupButton.style.display = "inline-block";
  } catch (err) {
    console.log(err);
  }
}
