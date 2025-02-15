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

const state = require('../state');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/xml');

  const { id, version } = state.getExtension();

  // prettier-ignore
  res.send(`
<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='${id}'>
    <updatecheck codebase='${process.env.UPDATE_URL}/extension.crx' version='${version}' />
  </app>
</gupdate>
  `.trim());
};
