const images = ["square_image_5.jpg", "square_image_2.jpg", "square_image_3.jpg", "square_image_4.jpg"];
let zonesPerCamera = {};
let currentCamera = 0;
let selectedColor = "red";
let clickPoints = [];

const zoneCanvas = document.getElementById("zoneCanvas");
const ctx = zoneCanvas.getContext("2d");

// Load camera boxes
const cameraGrid = document.getElementById("cameraGrid");
images.forEach((img, index) => {
  const box = document.createElement("div");
  box.className = "camera-box";
  box.innerHTML = `
    <img src="${img}" onclick="openEditor(${index})" />
    <div class="camera-strip">
      <span>Camera ${index + 1}</span>
      <button onclick="openEditor(${index})">Edit Zones</button>
    </div>
  `;
  cameraGrid.appendChild(box);
});

document.getElementById("zoneColor").addEventListener("change", (e) => {
  selectedColor = e.target.value;
});

// Live clock
setInterval(() => {
  document.getElementById("clock").textContent = new Date().toLocaleString();
}, 1000);

window.openEditor = function (cameraIndex) {
  currentCamera = cameraIndex;
  document.getElementById("modalTitle").textContent = `Edit Zones - Camera ${cameraIndex + 1}`;
  document.getElementById("zoneModal").style.display = "block";

  const img = new Image();
  img.src = images[cameraIndex];
  img.onload = () => {
    ctx.clearRect(0, 0, zoneCanvas.width, zoneCanvas.height);
    ctx.drawImage(img, 0, 0, zoneCanvas.width, zoneCanvas.height);
    drawZones();
  };
};

window.closeModal = function () {
  document.getElementById("zoneModal").style.display = "none";
  clickPoints = [];
};

zoneCanvas.addEventListener("click", (e) => {
  const rect = zoneCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  clickPoints.push({ x, y });

  if (clickPoints.length === 4) {
    if (!zonesPerCamera[currentCamera]) zonesPerCamera[currentCamera] = [];
    zonesPerCamera[currentCamera].push({ color: selectedColor, points: [...clickPoints] });
    clickPoints = [];
    redrawCanvas();
  }
});

function redrawCanvas() {
  const img = new Image();
  img.src = images[currentCamera];
  img.onload = () => {
    ctx.clearRect(0, 0, zoneCanvas.width, zoneCanvas.height);
    ctx.drawImage(img, 0, 0, zoneCanvas.width, zoneCanvas.height);
    drawZones();
  };
}

function drawZones() {
  const zones = zonesPerCamera[currentCamera] || [];
  zones.forEach(zone => {
    const [p1, , p3] = zone.points;
    const width = p3.x - p1.x;
    const height = p3.y - p1.y;
    ctx.beginPath();
    ctx.strokeStyle = zone.color;
    ctx.lineWidth = 3;
    ctx.rect(p1.x, p1.y, width, height);
    ctx.stroke();
  });
}

window.clearZones = function () {
  zonesPerCamera[currentCamera] = [];
  redrawCanvas();
};

window.saveZones = function () {
  const data = JSON.stringify(zonesPerCamera, null, 2);
  console.log("Saved Zones JSON:\n", data);
  alert("Zones saved for this camera!");
};

// Auto-update the latest violation snapshot from first alert
window.addEventListener("DOMContentLoaded", () => {
  const firstAlert = document.querySelector(".alert-list .alert");
  if (firstAlert) {
    const img = firstAlert.querySelector("img").src;
    const text = firstAlert.querySelector("span").innerText;

    const latestImg = document.querySelector(".latest-img");
    const latestText = document.querySelector(".latest-details");

    if (latestImg && latestText) {
      latestImg.src = img;
      latestText.textContent = text;
    }
  }
});
