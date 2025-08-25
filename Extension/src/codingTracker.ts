import * as vscode from 'vscode';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

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
    private socket: Socket | null = null;
    private isTracking: boolean = false;
    private lastSaveTime: Date = new Date();
    private linesChanged: number = 0;
    private charactersTyped: number = 0;
    private changeListener: vscode.TextDocumentChangeEvent | null = null;
    private realTimeInterval: NodeJS.Timeout | null = null;

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
        
        // Initialize WebSocket connection when token is set
        this.initializeWebSocket();
    }

    private initializeWebSocket() {
        if (!this.token) return;

        try {
            // Connect to WebSocket server
            this.socket = io(this.apiUrl, {
                transports: ['websocket', 'polling']
            });

            this.socket.on('connect', () => {
                console.log('🔌 WebSocket connected');
                vscode.window.showInformationMessage('Prime Time real-time connection established!');
                
                // Authenticate with the server
                this.socket?.emit('authenticate', { token: this.token });
            });

            this.socket.on('authenticated', (data) => {
                console.log('✅ WebSocket authenticated:', data);
                vscode.window.showInformationMessage('Prime Time real-time tracking activated!');
            });

            this.socket.on('auth_error', (error) => {
                console.error('❌ WebSocket auth error:', error);
                vscode.window.showErrorMessage('Prime Time authentication failed. Check your token.');
            });

            this.socket.on('data_received', (response) => {
                console.log('✅ Real-time data received:', response);
            });

            this.socket.on('error', (error) => {
                console.error('❌ WebSocket error:', error);
                vscode.window.showErrorMessage('Prime Time real-time connection error.');
            });

            this.socket.on('disconnect', () => {
                console.log('🔌 WebSocket disconnected');
                vscode.window.showInformationMessage('Prime Time real-time connection lost.');
            });

        } catch (error) {
            console.error('❌ Failed to initialize WebSocket:', error);
            vscode.window.showErrorMessage('Failed to establish real-time connection.');
        }
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

        // Start real-time updates
        this.startRealTimeUpdates();

        vscode.window.showInformationMessage('Prime Time tracking started with real-time updates!');
    }

    private startRealTimeUpdates() {
        // Send real-time updates every 30 seconds
        this.realTimeInterval = setInterval(() => {
            if (this.currentSession && this.currentSession.isActive && this.socket) {
                const currentTime = new Date();
                const duration = currentTime.getTime() - this.currentSession.startTime.getTime();
                
                const realTimeData = {
                    fileName: this.getFileNameFromPath(this.currentSession.currentFile),
                    filePath: this.currentSession.currentFile,
                    language: this.currentSession.language,
                    folder: this.currentSession.folder,
                    duration: duration,
                    linesChanged: this.linesChanged,
                    charactersTyped: this.charactersTyped,
                    isActive: true
                };

                this.socket.emit('session_update', realTimeData);
                console.log('🔄 Real-time update sent:', realTimeData);
            }
        }, 30000); // 30 seconds
    }

    public stopTracking() {
        this.isTracking = false;
        this.endCurrentSession();
        
        // Stop real-time updates
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
            this.realTimeInterval = null;
        }

        // Disconnect WebSocket
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

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

        // Send immediate update via WebSocket
        this.sendRealTimeUpdate();
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
        
        // Send save event via WebSocket
        this.sendRealTimeUpdate();
    }

    private sendRealTimeUpdate() {
        if (!this.currentSession || !this.currentSession.isActive || !this.socket) return;

        const currentTime = new Date();
        const duration = currentTime.getTime() - this.currentSession.startTime.getTime();

        const realTimeData = {
            fileName: this.getFileNameFromPath(this.currentSession.currentFile),
            filePath: this.currentSession.currentFile,
            language: this.currentSession.language,
            folder: this.currentSession.folder,
            duration: duration,
            linesChanged: this.linesChanged,
            charactersTyped: this.charactersTyped,
            isActive: true
        };

        this.socket.emit('coding_data', realTimeData);
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

        // Send session start via WebSocket
        this.sendRealTimeUpdate();
    }

    private endCurrentSession() {
        if (!this.currentSession || !this.currentSession.isActive) return;

        const endTime = new Date();
        const duration = endTime.getTime() - this.currentSession.startTime.getTime();

        if (duration > 0) {
            // Send final session data via WebSocket
            if (this.socket) {
                const finalData = {
                    fileName: this.getFileNameFromPath(this.currentSession.currentFile),
                    filePath: this.currentSession.currentFile,
                    language: this.currentSession.language,
                    folder: this.currentSession.folder,
                    duration: duration,
                    linesChanged: this.linesChanged,
                    charactersTyped: this.charactersTyped,
                    isActive: false
                };

                this.socket.emit('coding_data', finalData);
                console.log('📊 Final session data sent:', finalData);
            }

            // Also send via HTTP as backup
            this.sendCodingData({
                userId: this.token,
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
        // Get the workspace folder name that's actually opened in VS Code
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            // Use the first workspace folder name
            return workspaceFolders[0].name;
        }
        
        // Fallback: try to get meaningful folder name from path
        const pathParts = filePath.split('/');
        if (pathParts.length > 1) {
            // Look for meaningful folder names (skip system paths)
            for (let i = pathParts.length - 2; i >= 0; i--) {
                const potentialFolder = pathParts[i];
                // Skip common system folders and use meaningful project folders
                if (potentialFolder && 
                    !['home', 'Desktop', 'sa', 'src', 'dist', 'node_modules', 'build', 'public'].includes(potentialFolder.toLowerCase())) {
                    return potentialFolder;
                }
            }
        }
        
        return 'Unknown';
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