const vscode = require("vscode");

class SidebarProvider {
  constructor(_extensionUri) {
    this._extensionUri = _extensionUri;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  revive(panel) {
    this._view = panel;
  }

  _getHtmlForWebview(webview) {
    return `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>ChatMind</title>
            <script src="https://cdn.jsdelivr.net/npm/markdown-it@10.0.0/dist/markdown-it.min.js"></script>
          </head>
          <body
            style="
              width: 100%;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
            "
          >
            <div id="chat-output" style="width: 90%; padding: 2px; flex-wrap: wrap;"></div>
            <form
              id="chat-form"
              style="
                position: absolute;
                bottom: 0;
                width: 90%;
                display: flex;
                align-items: center;
                padding: 2px;
                background-color: white;
                border-radius: 5px;
                border-width: 1px;
                border-color: 'black';
              "
            >
              <input
                type="text"
                id="user-input"
                placeholder="Ask your problem here..."
                style="
                  flex-grow: 1;
                  border: none;
                  outline: none;
                  font-size: 16px;
                  padding: 10px;
                  background-color: transparent;
                "
              />
              <button
                type="submit"
                style="border: none; cursor: pointer; margin-top: 5px; background-color: white;"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#2A62C1"
                  width="24px"
                  height="24px"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </button>
            </form>
            <script>
              var md = window.markdownit();

              const chatForm = document.getElementById("chat-form");
              const userInput = document.getElementById("user-input");
              const chatOutput = document.getElementById("chat-output");

              chatForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const message = userInput.value;
                userInput.value = "";
                const endpoint = "https://api.openai.com/v1/chat/completions";
                const data = {
                  model: "gpt-3.5-turbo",
                  messages: [{ role: "user", content: message }],
                  max_tokens: 1000,
                  temperature: 0.5,
                };
                fetch(endpoint, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization:
                      "Bearer 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",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                    const chatResponse = data.choices[0].message.content;
                    const chatOutputDiv = document.createElement("div");
                    chatOutputDiv.innerHTML = md.render(chatResponse);
                    chatOutput.appendChild(chatOutputDiv);
                  })
                  .catch((error) => {
                    console.error("Error fetching ChatGPT API:", error);
                  });
              });
            </script>
          </body>
        </html>
      `;
  }
}

module.exports = { SidebarProvider };
