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
