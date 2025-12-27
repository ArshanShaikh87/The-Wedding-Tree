document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#id_video_url");
  if (!input) return;

  // Create upload button
  const uploadBtn = document.createElement("button");
  uploadBtn.type = "button";
  uploadBtn.innerText = "Upload Video to Cloudinary";
  uploadBtn.style.marginTop = "10px";
  uploadBtn.className = "button";

  input.parentNode.appendChild(uploadBtn);

  uploadBtn.addEventListener("click", function () {
    cloudinary.openUploadWidget(
      {
        cloudName: "YOUR_CLOUD_NAME",
        uploadPreset: "YOUR_UNSIGNED_PRESET",
        sources: ["local"],
        resourceType: "video",
        multiple: false,
        maxFileSize: 200000000, // 200MB
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          input.value = result.info.secure_url;
        }
      }
    );
  });
});
