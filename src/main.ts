import { Plugin, WorkspaceLeaf, ItemView } from 'obsidian';

const VIEW_TYPE_CHATGPT = "chatgpt-view";

class ChatGPTView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_CHATGPT;
    }

    getDisplayText() {
        return "ChatGPT";
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        
        const iframe = document.createElement('iframe');
        iframe.src = 'https://chat.openai.com/';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        container.appendChild(iframe);
    }

    async onClose() {
        // Cleanup if needed
    }
}

export default class ChatGPTPlugin extends Plugin {
    async onload() {
        this.registerView(
            VIEW_TYPE_CHATGPT,
            (leaf) => new ChatGPTView(leaf)
        );
        
        this.addRibbonIcon('dice', 'Open ChatGPT', () => {
            this.activateView();
        });

        this.addCommand({
            id: 'open-chatgpt',
            name: 'Open ChatGPT',
            callback: () => this.activateView()
        });
    }

    async activateView() {
        if (!this.app.workspace) {
            return;
        }

        this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHATGPT);

        const rightLeaf = this.app.workspace.getRightLeaf(false);
        if (!rightLeaf) {
            return;
        }

        await rightLeaf.setViewState({
            type: VIEW_TYPE_CHATGPT,
            active: true,
        });

        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(VIEW_TYPE_CHATGPT)[0]
        );
    }

    async onunload() {
        if (this.app.workspace) {
            this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHATGPT);
        }
    }
}
