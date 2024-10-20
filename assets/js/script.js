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
  data.forEach((items) => {
    let content = renderBlogContent(items);
    blogSection.appendChild(content);
  });
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
});
