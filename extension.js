const vscode = require("vscode");
const { SidebarProvider } = require("./src/sideBar");

function activate(context) {
  // Register the Sidebar Panel
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "ChatId",
      sidebarProvider
    )
  );

  // Register a custom command with actions
  context.subscriptions.push(
    vscode.commands.registerCommand("ChatMind.askquestion", async () => {
      let response = await vscode.window.showInformationMessage(
        "How are you doing?",
        "Good",
        "Bad"
      );
      if (response === "Bad") {
        vscode.window.showInformationMessage("I'm sorry");
      } else {
        vscode.window.showInformationMessage("Glad that you liked it");
      }
    })
  );

  // Register a custom command
  context.subscriptions.push(
    vscode.commands.registerCommand("ChatMind.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World!");
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
