(function () {
  'use strict';

  if (window.__lenavaWidget) return;
  window.__lenavaWidget = true;

  var BASE_URL = 'https://lenava.io';

  function getSessionId() {
    try {
      var stored = localStorage.getItem('lenava_widget_session');
      if (stored) return stored;
      var id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
          });
      localStorage.setItem('lenava_widget_session', id);
      return id;
    } catch (_) {
      return 'session-' + Math.random().toString(36).slice(2);
    }
  }

  function getLang() {
    try {
      return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en';
    } catch (_) {
      return 'en';
    }
  }

  var sessionId = getSessionId();
  var lang = getLang();
  var isOpen = false;

  var CHAT_BUBBLE_SVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>' +
    '</svg>';

  var CLOSE_SVG =
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M14 4L4 14M4 4L14 14" stroke="white" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

  var styles = [
    '/* Lenava Widget */',
    '.lnv-btn {',
    '  position: fixed;',
    '  bottom: 24px;',
    '  right: 24px;',
    '  width: 52px;',
    '  height: 52px;',
    '  border-radius: 50%;',
    '  background: #7C3AED;',
    '  border: none;',
    '  cursor: pointer;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  z-index: 2147483647;',
    '  transition: background 150ms, transform 150ms;',
    '  box-shadow: 0 4px 16px rgba(124,58,237,0.35);',
    '}',
    '.lnv-btn:hover { background: #6D28D9; }',
    '.lnv-btn.pulse { animation: lnv-pulse 0.8s ease 3; }',
    '@keyframes lnv-pulse {',
    '  0% { transform: scale(1); }',
    '  50% { transform: scale(1.12); }',
    '  100% { transform: scale(1); }',
    '}',
    '.lnv-panel {',
    '  position: fixed;',
    '  bottom: 88px;',
    '  right: 24px;',
    '  width: 360px;',
    '  height: 520px;',
    '  background: #fff;',
    '  border: 1px solid #D4D4D4;',
    '  border-radius: 16px;',
    '  z-index: 2147483646;',
    '  display: flex;',
    '  flex-direction: column;',
    '  overflow: hidden;',
    '  opacity: 0;',
    '  transform: translateY(16px);',
    '  pointer-events: none;',
    '  transition: opacity 200ms ease, transform 200ms ease;',
    '}',
    '.lnv-panel.open {',
    '  opacity: 1;',
    '  transform: translateY(0);',
    '  pointer-events: auto;',
    '}',
    '.lnv-header {',
    '  height: 56px;',
    '  background: #0A0A0A;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  padding: 0 16px;',
    '  flex-shrink: 0;',
    '}',
    '.lnv-header-title {',
    '  font-family: monospace;',
    '  font-size: 12px;',
    '  letter-spacing: 0.2em;',
    '  color: #fff;',
    '  font-weight: 500;',
    '}',
    '.lnv-close {',
    '  background: none;',
    '  border: none;',
    '  cursor: pointer;',
    '  padding: 4px;',
    '  display: flex;',
    '  align-items: center;',
    '  opacity: 0.8;',
    '  transition: opacity 150ms;',
    '}',
    '.lnv-close:hover { opacity: 1; }',
    '.lnv-iframe {',
    '  width: 100%;',
    '  flex: 1;',
    '  border: none;',
    '  border-radius: 0 0 16px 16px;',
    '  display: block;',
    '}',
    '@media (max-width: 480px) {',
    '  .lnv-panel {',
    '    width: calc(100vw - 16px);',
    '    right: 8px;',
    '    bottom: 80px;',
    '    height: 70dvh;',
    '  }',
    '  .lnv-btn { bottom: 16px; right: 16px; }',
    '}',
  ].join('\n');

  var shadow, button, panel, iframe, styleEl;

  function createWidget() {
    var host = document.createElement('div');
    host.id = 'lenava-widget-host';
    document.body.appendChild(host);

    shadow = host.attachShadow({ mode: 'open' });

    styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadow.appendChild(styleEl);

    button = document.createElement('button');
    button.className = 'lnv-btn pulse';
    button.setAttribute('aria-label', 'Open Lenava chat');
    button.innerHTML = CHAT_BUBBLE_SVG;
    button.addEventListener('click', togglePanel);
    shadow.appendChild(button);

    panel = document.createElement('div');
    panel.className = 'lnv-panel';
    shadow.appendChild(panel);

    var header = document.createElement('div');
    header.className = 'lnv-header';

    var title = document.createElement('span');
    title.className = 'lnv-header-title';
    title.textContent = 'L E N A V A';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'lnv-close';
    closeBtn.setAttribute('aria-label', 'Close chat');
    closeBtn.innerHTML = CLOSE_SVG;
    closeBtn.addEventListener('click', closePanel);

    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    iframe = document.createElement('iframe');
    iframe.className = 'lnv-iframe';
    iframe.setAttribute('title', 'Lenava Chat');
    iframe.setAttribute('allow', 'clipboard-write');
    panel.appendChild(iframe);

    button.addEventListener('animationend', function () {
      button.classList.remove('pulse');
    });
  }

  function openPanel() {
    if (!iframe.src) {
      iframe.src = BASE_URL + '/chat?widget=true&lang=' + lang;
    }
    isOpen = true;
    panel.classList.add('open');
    button.setAttribute('aria-label', 'Close Lenava chat');
    button.innerHTML = CLOSE_SVG;
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('open');
    button.setAttribute('aria-label', 'Open Lenava chat');
    button.innerHTML = CHAT_BUBBLE_SVG;
  }

  function togglePanel() {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
