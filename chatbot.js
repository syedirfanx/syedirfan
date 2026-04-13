import { getChatResponse } from './gemini.js';
import { marked } from 'marked';

// Configure marked for security
marked.setOptions({
  breaks: true,
  gfm: true
});

function initChatbot() {
  // Inject Chatbot HTML
  const chatbotHTML = `
    <div id="chatbot-trigger" title="Chat with Syed AI">
      <i data-lucide="message-square" class="w-6 h-6"></i>
    </div>
    <div id="chatbot-window" class="hidden">
      <div class="chat-header">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            <i data-lucide="bot" class="w-5 h-5 text-white"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">Syed AI</h3>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p class="text-[10px] text-zinc-500 uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button id="minimize-chat" class="p-2 text-zinc-500 hover:text-white transition-colors" title="Minimize">
            <i data-lucide="minus" class="w-4 h-4"></i>
          </button>
          <button id="maximize-chat" class="p-2 text-zinc-500 hover:text-white transition-colors" title="Maximize">
            <i data-lucide="maximize-2" class="w-4 h-4"></i>
          </button>
          <button id="close-chat" class="p-2 text-zinc-500 hover:text-white transition-colors" title="Close Chat">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
      <div id="chat-messages" class="chat-messages">
        <!-- Initial message will be handled by JS to ensure markdown rendering -->
      </div>
      <div class="chat-input-area">
        <input type="text" id="chat-input" placeholder="Ask me anything..." autocomplete="off">
        <button id="send-chat" class="chat-send-btn">
          <i data-lucide="send" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = chatbotHTML;
  document.body.appendChild(container);

  // Initialize Lucide icons for the injected HTML
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const trigger = document.getElementById('chatbot-trigger');
  const window_ = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('close-chat');
  const minimizeBtn = document.getElementById('minimize-chat');
  const maximizeBtn = document.getElementById('maximize-chat');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-chat');
  const messagesContainer = document.getElementById('chat-messages');

  let chatHistory = JSON.parse(localStorage.getItem('syed_ai_history') || '[]');
  let isOpen = localStorage.getItem('syed_ai_open') === 'true';
  let isMaximized = localStorage.getItem('syed_ai_maximized') === 'true';

  const addMessage = (text, role, save = true) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    if (role === 'ai') {
      msgDiv.innerHTML = marked.parse(text);
      // Ensure links open in new tab
      msgDiv.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.classList.add('text-white', 'underline', 'hover:text-zinc-300', 'transition-colors');
      });
    } else {
      msgDiv.textContent = text;
    }
    
    messagesContainer.appendChild(msgDiv);
    
    // Smooth scroll to bottom
    setTimeout(() => {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);

    if (save && role !== 'typing') {
      // We don't save to history here anymore, we do it in handleSend
    }
  };

  const saveState = () => {
    localStorage.setItem('syed_ai_history', JSON.stringify(chatHistory));
    localStorage.setItem('syed_ai_open', !window_.classList.contains('hidden'));
    localStorage.setItem('syed_ai_maximized', window_.classList.contains('maximized'));
  };

  const toggleMaximize = () => {
    const maximized = window_.classList.toggle('maximized');
    const icon = maximizeBtn.querySelector('[data-lucide]');
    
    if (icon) {
      if (maximized) {
        icon.setAttribute('data-lucide', 'minimize-2');
        maximizeBtn.setAttribute('title', 'Minimize');
      } else {
        icon.setAttribute('data-lucide', 'maximize-2');
        maximizeBtn.setAttribute('title', 'Maximize');
      }
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
    saveState();
  };

  // Initialize Chat
  const initChat = () => {
    messagesContainer.innerHTML = '';
    if (chatHistory.length === 0) {
      addMessage("Hello! I'm **Syed AI**. I can tell you about Syed's projects, skills, or even his favorite photography spots. How can I help you today?", 'ai', false);
    } else {
      chatHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'user' : 'ai';
        addMessage(msg.parts[0].text, role, false);
      });
    }

    if (isOpen) {
      window_.classList.remove('hidden');
      trigger.classList.add('active');
    }

    if (isMaximized) {
      window_.classList.add('maximized');
      const icon = maximizeBtn.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', 'minimize-2');
      }
      if (window.lucide) window.lucide.createIcons();
    }
  };

  initChat();

  const toggleChat = () => {
    const isHidden = window_.classList.toggle('hidden');
    trigger.classList.toggle('active');
    
    if (!isHidden) {
      input.focus();
    }
    
    saveState();
  };

  const closeChat = () => {
    window_.classList.add('hidden');
    trigger.classList.remove('active');
    // Optionally clear history if "remove" means delete
    // chatHistory = [];
    // localStorage.removeItem('syed_ai_history');
    // initChat();
    saveState();
  };

  trigger.addEventListener('click', toggleChat);
  minimizeBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', closeChat);
  maximizeBtn.addEventListener('click', toggleMaximize);

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage(text, 'user');
    
    // Update history immediately for user message
    chatHistory.push({ role: 'user', parts: [{ text }] });
    saveState();

    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing-container';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    
    // Scroll to typing indicator
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });

    try {
      // Get AI response with a timeout
      const responsePromise = getChatResponse(text, chatHistory.slice(0, -1));
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 30000)
      );

      const response = await Promise.race([responsePromise, timeoutPromise]);
      
      // Remove typing indicator
      if (typingDiv.parentNode) {
        messagesContainer.removeChild(typingDiv);
      }

      addMessage(response, 'ai');
      
      // Update history
      chatHistory.push({ role: 'model', parts: [{ text: response }] });
      
      // Keep history manageable
      if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(-20);
      }
      saveState();
    } catch (error) {
      console.error('Chat error:', error);
      if (typingDiv.parentNode) {
        messagesContainer.removeChild(typingDiv);
      }
      addMessage("Sorry, I encountered an error. Please try again.", 'ai');
    }
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
