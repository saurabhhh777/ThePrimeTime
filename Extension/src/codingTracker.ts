import * as vscode from 'vscode';
import axios from 'axios';

interface CodingSession {
    startTime: Date;
    currentFile: string;
    language: string;
    folder: string;
    isActive: boolean;
}

interface CodingData {
    userId: string;
    timestamp: Date;
    fileName: string;
    filePath: string;
    language: string;
    folder: string;
    duration: number;
    linesChanged: number;
    charactersTyped: number;
}

export class CodingTracker {
    private context: vscode.ExtensionContext;
    private currentSession: CodingSession | null = null;
    private token: string = '';
    private apiUrl: string = 'http://localhost:7000'; // Fixed port to 7000
    private isTracking: boolean = false;
    private lastSaveTime: Date = new Date();
    private linesChanged: number = 0;
    private charactersTyped: number = 0;
    private changeListener: vscode.TextDocumentChangeEvent | null = null;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadToken();
        this.loadApiUrl();
    }

    private async loadToken() {
        this.token = this.context.globalState.get('primeTimeToken', '');
    }

    private loadApiUrl() {
        const config = vscode.workspace.getConfiguration('thePrimeTime');
        this.apiUrl = config.get<string>('apiUrl', 'http://localhost:7000'); // Fixed default port
    }

    public setToken(token: string) {
        this.token = token;
        this.context.globalState.update('primeTimeToken', token);
        vscode.window.showInformationMessage('Prime Time token updated successfully!');
    }

    public startTracking() {
        if (this.isTracking) return;

        this.isTracking = true;
        
        // Listen for document changes
        vscode.workspace.onDidChangeTextDocument((event) => {
            this.handleDocumentChange(event);
        });

        // Listen for active editor changes
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            this.handleEditorChange(editor);
        });

        // Listen for document saves
        vscode.workspace.onDidSaveTextDocument((document) => {
            this.handleDocumentSave(document);
        });

        // Start initial session if editor is active
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            this.startSession(activeEditor.document);
        }

        vscode.window.showInformationMessage('Prime Time tracking started!');
    }

    public stopTracking() {
        this.isTracking = false;
        this.endCurrentSession();
        vscode.window.showInformationMessage('Prime Time tracking stopped!');
    }

    private handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
        if (!this.isTracking || !this.token) return;

        const document = event.document;
        
        // Update character count
        this.charactersTyped += event.contentChanges.reduce((sum, change) => {
            return sum + change.text.length;
        }, 0);

        // Start session if not active
        if (!this.currentSession || !this.currentSession.isActive) {
            this.startSession(document);
        }

        // Update current session
        if (this.currentSession) {
            this.currentSession.currentFile = document.fileName;
            this.currentSession.language = document.languageId;
            this.currentSession.folder = this.getFolderFromPath(document.fileName);
        }
    }

    private handleEditorChange(editor: vscode.TextEditor | undefined) {
        if (!this.isTracking || !this.token) return;

        if (editor) {
            this.startSession(editor.document);
        } else {
            this.endCurrentSession();
        }
    }

    private handleDocumentSave(document: vscode.TextDocument) {
        if (!this.isTracking || !this.token) return;

        this.linesChanged++;
        this.lastSaveTime = new Date();
    }

    private startSession(document: vscode.TextDocument) {
        if (this.currentSession && this.currentSession.isActive) {
            this.endCurrentSession();
        }

        this.currentSession = {
            startTime: new Date(),
            currentFile: document.fileName,
            language: document.languageId,
            folder: this.getFolderFromPath(document.fileName),
            isActive: true
        };
    }

    private endCurrentSession() {
        if (!this.currentSession || !this.currentSession.isActive) return;

        const endTime = new Date();
        const duration = endTime.getTime() - this.currentSession.startTime.getTime();

        if (duration > 0) {
            this.sendCodingData({
                userId: this.token, // Using token as userId for now
                timestamp: this.currentSession.startTime,
                fileName: this.getFileNameFromPath(this.currentSession.currentFile),
                filePath: this.currentSession.currentFile,
                language: this.currentSession.language,
                folder: this.currentSession.folder,
                duration: duration,
                linesChanged: this.linesChanged,
                charactersTyped: this.charactersTyped
            });
        }

        this.currentSession.isActive = false;
        this.linesChanged = 0;
        this.charactersTyped = 0;
    }

    private async sendCodingData(data: CodingData) {
        try {
            console.log('Sending coding data to:', `${this.apiUrl}/api/v1/coding-stats/submit`);
            console.log('Data:', data);
            
            const response = await axios.post(`${this.apiUrl}/api/v1/coding-stats/submit`, data, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Coding data sent successfully:', response.data);
            vscode.window.showInformationMessage('Coding session saved!');
        } catch (error) {
            console.error('Failed to send coding data:', error);
            vscode.window.showErrorMessage('Failed to save coding session. Check your token and connection.');
        }
    }

    private getFolderFromPath(filePath: string): string {
        const pathParts = filePath.split('/');
        return pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'root';
    }

    private getFileNameFromPath(filePath: string): string {
        const pathParts = filePath.split('/');
        return pathParts[pathParts.length - 1];
    }

    public getStatus(): string {
        if (!this.token) {
            return 'No token configured';
        }
        if (!this.isTracking) {
            return 'Tracking disabled';
        }
        if (this.currentSession && this.currentSession.isActive) {
            return `Tracking: ${this.currentSession.language} in ${this.currentSession.folder}`;
        }
        return 'Ready';
    }

    public getCurrentSessionTime(): number {
        if (!this.currentSession || !this.currentSession.isActive) {
            return 0;
        }
        return Date.now() - this.currentSession.startTime.getTime();
    }
} 