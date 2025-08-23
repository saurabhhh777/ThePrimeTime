import * as vscode from 'vscode';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'the-prime-time.showStatus';
        this.statusBarItem.tooltip = 'Click to show Prime Time status';
    }

    public show() {
        this.statusBarItem.show();
        this.updateStatus(0);
    }

    public updateStatus(sessionTimeMs: number) {
        if (sessionTimeMs > 0) {
            const minutes = Math.floor(sessionTimeMs / 60000);
            const seconds = Math.floor((sessionTimeMs % 60000) / 1000);
            this.statusBarItem.text = `$(clock) Prime Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            this.statusBarItem.text = '$(clock) Prime Time: Ready';
        }
    }

    public dispose() {
        this.statusBarItem.dispose();
    }
} 