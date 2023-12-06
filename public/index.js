const STATUS_ELEMENT = document.getElementById("status");
const DOWNLOAD_BUTTON = document.getElementById("download");
const WINDOWS_POLICY_ID = document.getElementById("windows-policy-id");
const WINDOWS_POLICY_HOST = document.getElementById("windows-policy-host");

let uploaded = false;

async function onUpload() {
  STATUS_ELEMENT.innerText = "Loading...";

  fetch("/upload/zip", { method: 'POST' }).then(onUploadFinished);
}

async function onUploadFinished(response) {
  const data = await response.json();

  if (data.success) {
    showDownloadInstructions(data.id, data.name, data.version);
  } else {
    STATUS_ELEMENT.innerText = data.message;
  }
}

function showDownloadInstructions(id, name, version) {
  STATUS_ELEMENT.innerText = `Serving "${name}" version ${version}`;

  WINDOWS_POLICY_ID.innerText = id;
  WINDOWS_POLICY_HOST.innerText = window.location.origin;
}

async function onDownload(event) {
  event.preventDefault();

  const handle = await showSaveFilePicker({
    suggestedName: "extension.crx",
    types: [
      {
        description: "Chrome Extension",
        accept: { "application/x-chrome-extension": [".crx"] }
      }
    ]
  });

  const response = await fetch("/extension.crx");
  const data = await response.blob();

  const writableStream = await handle.createWritable();
  await writableStream.write(data);
  await writableStream.close();
}

DOWNLOAD_BUTTON.addEventListener("click", onDownload);

fetch("/status")
  .then((response) => response.json())
  .then((response) => {
    if (response.serving) {
      showDownloadInstructions(response.id, response.name, response.version);
    } else {
      STATUS_ELEMENT.innerText = "Upload an extension to get started.";
    }
  });

onUpload();