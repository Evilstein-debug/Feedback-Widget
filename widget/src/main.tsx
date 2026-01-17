import { render } from 'preact';
import { App } from './app';
import style from './index.css?inline';

class FeedbackWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const projectKey = this.getAttribute('project-key') || '';

        if (this.shadowRoot) {
            const mountPoint = document.createElement('div');
            this.shadowRoot.appendChild(mountPoint);

            const styleTag = document.createElement('style');
            styleTag.textContent = style;
            this.shadowRoot.appendChild(styleTag);

            render(<App projectKey={projectKey} />, mountPoint);
        }
    }
}

// Check if element is already defined to avoid errors in hot reload environments
if (!customElements.get('feedback-widget')) {
    customElements.define('feedback-widget', FeedbackWidget);
}
