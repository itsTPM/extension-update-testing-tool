// Copyright 2023 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const uuid = require('uuid');
const state = require('../state');

module.exports = (_, res) => {
  res.setHeader('Content-Disposition', 'attachment');
  res.setHeader('Content-Type', 'application/xml');
  res.send(generateMobileConfig(state.getExtension().id));
};

function generateMobileConfig(extensionId) {
  const rootPayloadUuid = uuid.v4();
  const chromePayloadUuid = uuid.v4();

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadContent</key>
      <dict>
        <key>com.google.Chrome</key>
        <dict>
          <key>Forced</key>
          <array>
            <dict>
              <key>mcx_preference_settings</key>
              <dict>
                <key>ExtensionInstallAllowlist</key>
                <array>
                  <string>${extensionId}</string>
                </array>
                <key>ExtensionInstallSources</key>
                <array>
                  <string>${process.env.UPDATE_URL}/*</string>
                </array>
              </dict>
            </dict>
          </array>
        </dict>
      </dict>
      <key>PayloadEnabled</key>
      <true/>
      <key>PayloadIdentifier</key>
      <string>${chromePayloadUuid}</string>
      <key>PayloadType</key>
      <string>com.apple.ManagedClient.preferences</string>
      <key>PayloadUUID</key>
      <string>${chromePayloadUuid}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
    </dict>
  </array>
  <key>PayloadDescription</key>
  <string>Config generated by the extension-update-server tool</string>
  <key>PayloadDisplayName</key>
  <string>Extension Update Server</string>
  <key>PayloadIdentifier</key>
  <string>extensionupdateserver</string>
  <key>PayloadOrganization</key>
  <string></string>
  <key>PayloadRemovalDisallowed</key>
  <true/>
  <key>PayloadScope</key>
  <string>System</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${rootPayloadUuid}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;
}
