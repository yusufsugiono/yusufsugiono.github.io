/* ================
| Close Pop Up
*/

const closeBtn = document.querySelector(".close-btn");
const asideElement = document.querySelector("aside");

closeBtn.addEventListener("click", () => {
  asideElement.style.display = "none";
});

/* ================
| Fetch Data Blog
| from segalahal.com
*/

const blogUrl = "https://segalahal.com/wp-json/wp/v2/posts";
const params = {
  _fields: "link,title,excerpt,jetpack_featured_media_url",
  author: 2,
  per_page: 5,
  page: 1,
};

async function fetchBlogData(blogUrl, params) {
  const url = new URL(blogUrl);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    const blogSection = document.getElementById("section__blogpost");
    const blogNavLink = document.getElementById("link_to_blogpost");
    blogSection.style.display = "none";
    blogNavLink.style.display = "none";
    throw error;
  }
}

function renderBlogContent({
  link,
  title,
  jetpack_featured_media_url,
  excerpt,
}) {
  const blogElement = document.createElement("a");
  blogElement.setAttribute("href", link);
  blogElement.setAttribute("target", "_blank");

  const blogImage = document.createElement("img");
  blogImage.setAttribute("loading", "lazy");
  blogImage.setAttribute("src", jetpack_featured_media_url);
  blogImage.setAttribute("alt", `Thumbnail - ${title.rendered}`);

  const highlightBlogpost = document.createElement("div");
  highlightBlogpost.classList.add("highlight__blogpost");

  const blogTitle = document.createElement("h3");
  blogTitle.textContent = title.rendered;

  highlightBlogpost.innerHTML = excerpt.rendered;
  highlightBlogpost.prepend(blogTitle);

  blogElement.appendChild(blogImage);
  blogElement.appendChild(highlightBlogpost);

  return blogElement;
}

function renderBlog(data) {
  const blogSection = document.querySelector(".section__blogpost");

  const blogSectionHeading = document.createElement("h2");
  blogSectionHeading.textContent = "BLOG";

  blogSection.innerHTML = "";
  blogSection.appendChild(blogSectionHeading);

  data.forEach((items) => {
    let content = renderBlogContent(items);
    blogSection.appendChild(content);
  });

  const seeMoreBlog = document.createElement("a");
  seeMoreBlog.setAttribute("href", "https://segalahal.com");
  seeMoreBlog.setAttribute("target", "_blank");
  seeMoreBlog.classList.add("view-more");
  seeMoreBlog.innerHTML = "<p>SEE MORE ON SEGALAHAL.COM</p>";

  blogSection.appendChild(seeMoreBlog);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await fetchBlogData(blogUrl, params);
    renderBlog(data);
  } catch (error) {
    console.error("Error handling in DOM manipulation:", error);
  }
});

/* ================
| Sending form data
| Thanks to: Jamie Wilson & Sandhika Galih
| https://github.com/jamiewilson/form-to-google-sheets
| https://www.youtube.com/watch?v=2XosKncBoQ4
*/

// Validate Input Form
const whatsappInput = document.querySelector("#whatsapp");
whatsappInput.addEventListener("keydown", function (event) {
  // Izinkan tombol-tombol tertentu (Backspace, Delete, Arrow keys, dll.)
  const allowedKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Escape",
    "Enter",
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  // Dapatkan nilai saat ini ditambah karakter yang sedang diketik
  const currentValue = whatsappInput.value;
  const newValue = currentValue + event.key;

  // Izinkan hanya angka dan simbol +
  const isNumber = /^[0-9]$/.test(event.key);
  const isPlus = event.key === "+";

  // Karakter pertama bisa +, atau harus 0 jika bukan +
  if (currentValue.length === 0) {
    if (isPlus || event.key === "0") {
      return; // Izinkan + atau 0 sebagai karakter pertama
    } else {
      event.preventDefault(); // Blokir karakter lain sebagai karakter pertama
    }
  } else {
    // Jika karakter pertama adalah +, izinkan hanya angka
    if (currentValue[0] === "+") {
      if (!isNumber) {
        event.preventDefault(); // Blokir karakter selain angka setelah +
      }
    }
    // Jika karakter pertama adalah 0, izinkan hanya angka
    else if (currentValue[0] === "0") {
      if (!isNumber) {
        event.preventDefault(); // Blokir karakter selain angka
      }
    }
    // Blokir jika memulai dengan angka selain 0 atau +
    else {
      event.preventDefault(); // Blokir karakter tidak valid
    }
  }
});

function validateForm() {
  let isValid = true;

  // Validate Email
  const emailInput = document.querySelector("#email");
  const emailError = document.querySelector(".email-error");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailInput.value === "") {
    emailError.textContent = "Email is required.";
    emailError.style.visibility = "visible";
    emailInput.classList.add("input-email-error");
    isValid = false;
  } else if (!emailPattern.test(emailInput.value)) {
    emailError.textContent = "Please enter a valid email address!";
    emailError.style.visibility = "visible";
    emailInput.classList.add("input-email-error");
    isValid = false;
  } else {
    emailError.style.visibility = "hidden";
  }

  // Validate WhatsApp
  const waInput = document.querySelector("#whatsapp");
  const waError = document.querySelector(".whatsapp-error");
  const waPattern = /^(?:\+|0)[0-9]+$/;
  if (waInput.value !== "" && !waPattern.test(waInput.value)) {
    waError.textContent =
      "Please enter a valid phone number! (eg. +6281234567890)";
    waError.style.visibility = "visible";
    waInput.classList.add("input-whatsapp-error");
    isValid = false;
  } else {
    waError.style.visibility = "hidden";
  }

  // Validate Full Name
  const nameInput = document.querySelector("#sender_name");
  const nameError = document.querySelector(".sender_name-error");
  if (nameInput.value === "") {
    nameError.textContent = "Full Name is required.";
    nameError.style.visibility = "visible";
    nameInput.classList.add("input-sender_name-error");
    isValid = false;
  } else {
    nameError.style.visibility = "hidden";
  }

  // Validate Message
  const msgInput = document.querySelector("#message");
  const msgError = document.querySelector(".message-error");
  if (msgInput.value === "") {
    msgError.textContent = "Message is required.";
    msgError.style.visibility = "visible";
    msgInput.classList.add("input-message-error");
    isValid = false;
  } else {
    msgError.style.visibility = "hidden";
  }

  return isValid;
}

// Remove error message when user types
document.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("input", function () {
    const errorElement = document.querySelector("." + this.id + "-error");
    errorElement.style.visibility = "hidden";
    this.className = "";
  });
});

// Change submit button when sending data
function sendingData() {
  const submitBtn = document.querySelector("button");
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Send';
  submitBtn.setAttribute("disabled", "disabled");
}

function afterSendingData() {
  const submitBtn = document.querySelector("button");
  submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send';
  submitBtn.removeAttribute("disabled");
}

// Build alert
function buildFormAlert(status) {
  const contactMeSection = document.querySelector(".section__contact_me");
  const contactMeHeading = document.querySelector(".section__contact_me>h2");

  const alertElement = document.createElement("div");
  alertElement.classList.add(
    status === "success" ? "alert-success" : "alert-danger"
  );

  const alertText = document.createElement("p");
  alertText.innerHTML =
    status === "success"
      ? "<b>Thank You.</b> Your message has been sent."
      : "<b>Oops!</b> Your message failed to send. Please try again later.";

  const alertCloseBtn = document.createElement("div");
  alertCloseBtn.classList.add("close-btn");
  alertCloseBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  alertCloseBtn.onclick = function () {
    this.parentElement.style.opacity = 0;
    setTimeout(() => {
      this.parentElement.style.display = "none";
    }, 1000);
  };

  alertElement.appendChild(alertCloseBtn);
  alertElement.appendChild(alertText);
  contactMeSection.insertBefore(alertElement, contactMeHeading.nextSibling);
  setTimeout(() => {
    alertElement.style.opacity = 1;
  }, 100);
}

function autoCloseAlert() {
  const alertElement = document.querySelector('div[class*="alert"]');
  alertElement.style.opacity = 0;
  setTimeout(() => {
    alertElement.style.display = "none";
  }, 1000);
}

const scriptURL =
  "https://script.google.com/macros/s/AKfycbz8i9-B1AYpThAJXdywXP3JVBtCYwHFJyrqKCkpYZy2hHcljzSPlb8DRaxqJiktNPeSZQ/exec";
const form = document.forms["contact_me"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const isValid = validateForm();
  if (isValid) {
    sendingData();
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(() => {
        form.reset();
        buildFormAlert("success");
      })
      .catch(() => {
        return buildFormAlert("error");
      })
      .finally(() => {
        afterSendingData();
        setTimeout(() => {
          if (document.querySelector('div[class*="alert"]') !== null) {
            autoCloseAlert();
          }
        }, 10000);
      });
  }
});
