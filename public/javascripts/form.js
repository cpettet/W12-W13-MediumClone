window.addEventListener("DOMContentLoaded", async () => {

  const isRecipe = document.querySelector("#postType");
  const recipeContainer = document.querySelector(".recipe");

  isRecipe.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value === "recipe") {
      recipeContainer.hidden = false;
    } else {
      recipeContainer.hidden = true;
    }
  });

  const deleteButton = document.querySelector("#post-delete");
  // grabs the id of the post
  const postId = window.location.href.split("posts/")[1];
  deleteButton.addEventListener("click", async (e) => {
    // Let's come back to this
    e.preventDefault();
    try {
      const res = await fetch(`/posts/${postId}`, { method: "DELETE" });
      if (res.status !== 200) {
        throw Error("Post was not deleted");
      }
      window.location.replace("/");
    } catch (e) {
      const errorBox = document.querySelector(".error-box");
      errorBox.hidden = false;
      errorBox.innerHTML = e;
      errorBox.style.textAlign = "center";
      errorBox.style.marginTop = "1rem";
    }
  });

  const modifyButton = document.querySelector("#post-edit");
  modifyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector(".form-box");
    const formData = new FormData(form);
    const title = formData.get("title");
    const post_type = formData.get("postType");
    const isComments = formData.get("isComments");
    const isEmojis = formData.get("isEmojis");
    const doc_body = formData.get("body");
    const isVegetarian = formData.get("isVegetarian")
    const isVegan = formData.get("isVegan")
    const isGlutenFree = formData.get("isGlutenFree")
    const payload = {
      title,
      post_type,
      isComments: isComments === true,
      isEmojis: isEmojis === true,
      body: doc_body,
      isVegetarian: isVegetarian === true,
      isVegan: isVegan === true,
      isGlutenFree: isGlutenFree === true,
    };
    try {
      const res = await fetch(`/posts/${postId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.status !== 200) {
        throw Error("Post was not modified");
      }
      window.location.replace("/");
    } catch (e) {
      const errorBox = document.querySelector(".error-box");
      errorBox.hidden = false;
      errorBox.innerHTML = e;
      errorBox.style.textAlign = "center";
      errorBox.style.marginTop = "1rem";
    }
  });

  //listen for allowed comments && likes
  const allowComments = document.querySelector("select[name='isComments']");
  const commentsContainer = document.querySelector(".form-box.comment-box");

  if (allowComments.value === "true") {
    commentsContainer.hidden = false;
  } else {
    commentsContainer.hidden = true;
  }

  allowComments.addEventListener("change", (e) => {
    const isComments = allowComments.value;
    if (isComments === "true") {
      commentsContainer.hidden = false;
    } else {
      commentsContainer.hidden = true;
    }
  });

  const commentSubmit = document.querySelector("#add-comment");
  commentSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    //get commentBody value
    const content = document.querySelector("#comment-text-area").value;
    const payload = {
      content,
      post_id: postId,
    };
    try {
      const response = await fetch(`/comments`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.status !== 200) {
        throw new Error(`there was an error! The comment could not be added`);
      }
      window.location.replace("/");
    } catch (error) {
      const errorBox = document.querySelector(".error-box");
      errorBox.hidden = false;
      errorBox.innerHTML = e;
      errorBox.style.textAlign = "center";
      errorBox.style.marginTop = "1rem";
    }
  });

  const emojiContainers = document.querySelectorAll(".emoji-container");
  //loop over each emojiContainer
  emojiContainers.forEach((container) => {
    const emojiButton = container.childNodes[0];

    emojiButton.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const payload = {
          emoji: e.target.name,
          post_id: postId,
        };
        const response = await fetch("/likes", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (response.status !== 200) {
          throw new Error("there was an error");
        }
        const data = await response.json();

        e.target.nextElementSibling.innerText = data.count;
      } catch (error) {
        console.error(`there was an error`);
      }
    });
  });
  getEmojis(postId);
});

const getEmojis = async (postId) => {
  const emojiContainers = document.querySelectorAll(".emoji-container");
  const emojis = [];
  const count = [];
  emojiContainers.forEach((container) => {
    container.childNodes.forEach((e) => {
      if (e.id === "emoji") emojis.push(e.innerText);
      if (e.id === "count") count.push(e.innerText);
    });
  });
};
