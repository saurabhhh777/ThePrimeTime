import * as vscode from 'vscode';
import axios from 'axios';
import { CodingTracker } from './codingTracker';
import { StatusBarManager } from './statusBarManager';

let codingTracker: CodingTracker;
let statusBarManager: StatusBarManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('The Prime Time extension is now active!');

    // Initialize components
    codingTracker = new CodingTracker(context);
    statusBarManager = new StatusBarManager();

    // Register commands
    let setTokenCommand = vscode.commands.registerCommand('the-prime-time.setToken', async () => {
        const token = await vscode.window.showInputBox({
            prompt: 'Enter your Prime Time API token',
            password: true,
            placeHolder: 'Paste your token here...'
        });

        if (token) {
            await context.globalState.update('primeTimeToken', token);
            vscode.window.showInformationMessage('Prime Time token saved successfully!');
            codingTracker.setToken(token);
        }
    });

    let showStatusCommand = vscode.commands.registerCommand('the-prime-time.showStatus', () => {
        const status = codingTracker.getStatus();
        vscode.window.showInformationMessage(`Prime Time Status: ${status}`);
    });

    let openDashboardCommand = vscode.commands.registerCommand('the-prime-time.openDashboard', () => {
        const config = vscode.workspace.getConfiguration('thePrimeTime');
        const apiUrl = config.get<string>('apiUrl', 'http://localhost:3000');
        vscode.env.openExternal(vscode.Uri.parse(`${apiUrl}/dashboard`));
    });

    // Add commands to context
    context.subscriptions.push(setTokenCommand, showStatusCommand, openDashboardCommand);

    // Start tracking
    codingTracker.startTracking();
    statusBarManager.show();

    // Update status bar every minute
    setInterval(() => {
        statusBarManager.updateStatus(codingTracker.getCurrentSessionTime());
    }, 60000);
}

export function deactivate() {
    if (codingTracker) {
        codingTracker.stopTracking();
    }
    if (statusBarManager) {
        statusBarManager.dispose();
    }
} 