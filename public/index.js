const STATUS_ELEMENT = document.getElementById("status");
const WINDOWS_POLICY_ID = document.getElementById("windows-policy-id");
const WINDOWS_POLICY_HOST = document.getElementById("windows-policy-host");

fetch("/status")
  .then((response) => response.json())
  .then((response) => {
    if (response.serving) {
      showDownloadInstructions(response.id, response.name, response.version);
    } else {
      STATUS_ELEMENT.innerText = "Upload an extension to get started.";
    }
  });

function showDownloadInstructions(id, name, version) {
  STATUS_ELEMENT.innerText = `Serving "${name}" version ${version}`;

  WINDOWS_POLICY_ID.innerText = id;
  WINDOWS_POLICY_HOST.innerText = window.location.origin;
}