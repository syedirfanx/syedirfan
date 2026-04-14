// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // Initialize loader first
  initPageLoader();

  // Mobile menu should be initialized first as it's critical for navigation
  try {
    initMobileMenu();
  } catch (e) {
    console.error('Mobile menu init failed:', e);
  }

  try {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (e) {
    console.error('Lucide icons init failed:', e);
  }

  try {
    initStars();
  } catch (e) {
    console.error('Stars init failed:', e);
  }

  try {
    initWishes();
  } catch (e) {
    console.error('Wishes init failed:', e);
  }
});

// Toast Notification System
function showToast(message, title = 'Access Restricted') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.custom-toast');
  if (existingToast) existingToast.remove();

  const overlay = document.createElement('div');
  overlay.className = 'custom-toast fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm';
  overlay.style.animation = 'fadeIn 0.3s ease-out forwards';
  
  overlay.innerHTML = `
    <div class="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4 transform transition-all" style="animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards">
      <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div class="space-y-2">
        <h4 class="text-white font-bold tracking-tight">${title}</h4>
        <p class="text-zinc-400 text-sm leading-relaxed">${message}</p>
      </div>
      <button onclick="this.closest('.custom-toast').remove()" class="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">
        Understood
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);

  // Auto-remove after 5 seconds if not clicked
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.5s ease';
      setTimeout(() => overlay.remove(), 500);
    }
  }, 5000);
}
function openMobileMenu(e) {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  if (e) e.preventDefault();
  
  mobileMenu.classList.remove('hidden');
  mobileMenu.style.display = 'flex'; // Force display flex
  document.body.style.overflow = 'hidden';
  
  // Push state for back button support
  if (!history.state || history.state.modal !== 'menu') {
    history.pushState({ modal: 'menu' }, '');
  }
}

function closeMobileMenu(fromPopState = false) {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  
  mobileMenu.classList.add('hidden');
  mobileMenu.style.display = 'none'; // Force display none
  document.body.style.overflow = 'auto';
  
  // If closed via UI (not back button), and state exists, go back
  if (!fromPopState && history.state && history.state.modal === 'menu') {
    history.back();
  }
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuBtn || !mobileMenu) {
    console.warn('Mobile menu elements not found');
    return;
  }

  menuBtn.addEventListener('click', openMobileMenu);

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', () => closeMobileMenu());
  }

  // Close menu on link click
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => closeMobileMenu());
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMobileMenu();
    }
  });
}

// Page Loader Logic
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Hide loader on initial load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 500);
  });

  // Handle back-forward cache (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      loader.classList.add('hidden');
    }
  });

  // Fallback if window load doesn't fire or takes too long
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2500);

  // Show loader on link clicks
  document.querySelectorAll('a').forEach(link => {
    // Only for internal links
    const href = link.getAttribute('href');
    if (href && 
        !href.startsWith('http') && 
        !href.startsWith('#') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') && 
        !link.getAttribute('target') &&
        !link.hasAttribute('download')) {
      link.addEventListener('click', (e) => {
        const targetHref = link.href;
        
        // Don't show loader if it's the same page
        if (targetHref === window.location.href) return;

        e.preventDefault();
        loader.classList.remove('hidden');
        
        setTimeout(() => {
          window.location.href = targetHref;
        }, 400);
      });
    }
  });
}

// Star Background Animation
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let stars = [];
  const starCount = 150;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  class Star {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8;
      this.opacity = Math.random();
      this.speed = Math.random() * 0.005 + 0.002;
      this.direction = Math.random() > 0.5 ? 1 : -1;
      
      // Galaxy star colors (white, slight blue, slight yellow)
      const colors = [
        '255, 255, 255', // White
        '200, 220, 255', // Blueish
        '255, 245, 220', // Yellowish
        '255, 220, 255'  // Pinkish
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.opacity += this.speed * this.direction;
      if (this.opacity > 0.8 || this.opacity < 0.1) {
        this.direction *= -1;
      }
    }
    
    draw() {
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.4})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a very subtle glow to brighter stars
      if (this.size > 1.5 && this.opacity > 0.7) {
        ctx.shadowBlur = 3;
        ctx.shadowColor = `rgba(${this.color}, ${this.opacity * 0.2})`;
      } else {
        ctx.shadowBlur = 0;
      }
    }
  }
  
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    requestAnimationFrame(animate);
  }
  
  animate();
}

// Project Modal Logic
const projectsData = {
  'disease-classification': {
    title: 'Rice Leaf Disease Detection using Machine Learning Techniques',
    category: 'Publication and conference paper',
    overview: 'This project presents a rice leaf disease detection system using machine learning approaches. Three of the most common rice plant diseases namely leaf smut, bacterial leaf blight and brown spot diseases are detected in this work. Clear images of affected rice leaves with white background were used as the input. After necessary pre-processing, the dataset was trained on with a range of different machine learning algorithms including that of KNN(K-Nearest Neighbour), J48(Decision Tree), Naive Bayes and Logistic Regression. Decision tree algorithm, after 10-fold cross validation, achieved an accuracy of over 97% when applied on the test dataset.',
    collaborators: ['Kawser Ahmed', 'Tasmia Rahman Shahidi', '<span class="text-white font-bold">Syed Irfan</span>', 'Sifat Momen'],
    github: 'closed',
    document: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=MG9ta8wAAAAJ&authuser=1&citation_for_view=MG9ta8wAAAAJ:u5HHmVD_uO8C',
    tags: ['Machine Learning', 'Classification', 'Data Analysis']
  },
  'swarm-intelligence': {
    title: 'Feature Selection using Swarm Intelligence Techniques',
    category: 'MSc Thesis',
    overview: `
      <div class="space-y-4">
        <p>This project applies Particle Swarm Optimization (PSO) and Dispersive Flies Optimization (DFO) techniques for feature selection. The goal is to identify the optimal subset of features from a large dataset to improve classification accuracy in machine learning tasks.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Algorithm Implementation:</strong> Implemented PSO and DFO algorithms to select relevant features.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Dimensionality Reduction:</strong> Reduced dimensionality of datasets while enhancing model performance.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Performance Evaluation:</strong> Evaluated selected features on classification tasks to demonstrate accuracy improvements.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Data Processing:</strong> NumPy, Pandas</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Machine Learning:</strong> Scikit-learn (for classification models)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Optimization:</strong> Custom implementations of PSO and DFO</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Mohammad Majid al-Rifaie', 'Oroojeni MJ Hooman'],
    github: 'https://github.com/syedirfanx/swarm-intelligence',
    document: 'private',
    tags: ['Feature Engineering', 'Swarm Intelligence', 'Optimization']
  },
  'starpals-ai': {
    title: 'StarPals AI: Revolutionizing Talent Casting with Artificial Intelligence',
    category: 'Personal Innovation',
    overview: `
      <div class="space-y-4">
        <p>StarPals AI is a cutting-edge film casting platform that leverages advanced generative artificial intelligence to streamline the talent discovery process. It facilitates precise role-matching by analyzing actor profiles, scripts, and visual data through multi-modal learning.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">AI-Driven Profiling:</strong> Developed a platform for automated actor profiling, script analysis, and lookalike detection.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Intelligent Matching:</strong> Implemented precise role-matching algorithms using Generative AI and Natural Language Processing (NLP).</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Workflow Optimization:</strong> Streamlined the casting workflow for the entertainment industry with automated character extraction and visual similarity tools.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Generative AI:</strong> Google Gemini 2.5 Flash</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">AI Orchestration:</strong> Genkit</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Frameworks:</strong> Next.js 15 & React 19</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> TypeScript & Node.js</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">UI/UX:</strong> Tailwind CSS & Shadcn UI</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Database:</strong> In-memory MVP (Ready for Firebase Firestore integration)</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Lead Developer)'],
    github: 'https://github.com/syedirfanx/StarPalsAI',
    document: 'https://github.com/syedirfanx/StarPalsAI/tree/main/documents',
    tags: ['Generative AI', 'NLP', 'Next.js', 'TypeScript']
  },
  'face-mask-detector': {
    title: 'Face Mask Detection & Warning Systems',
    category: 'Industrial Project',
    overview: 'Developed a real-time face mask detection system using Convolutional Neural Networks (CNN). The model achieved 95% accuracy and was designed for deployment in public spaces to assist with safety compliance monitoring.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Computer Vision', 'CNN', 'TensorFlow', 'Real-time']
  },
  'id-card-ocr': {
    title: 'NID Card OCR System (Bangla & English)',
    category: 'Industrial Project',
    overview: 'An advanced OCR pipeline designed to extract both Bangla and English text from National ID cards. The system processes images to output structured JSON data, facilitating automated data entry for financial and governmental services.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['OCR', 'NLP', 'Bangla OCR', 'Python']
  },
  'flight-booking': {
    title: 'Flight Booking System',
    category: 'Academic Project',
    overview: 'A comprehensive full-stack application for flight management. It features a robust backend for handling complex scheduling, seat allocation, and user bookings with high concurrency.',
    collaborators: ['Syed Irfan', 'Project Partners'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Full Stack', 'Database Design', 'Backend']
  },
  'crowdfunding': {
    title: 'Secure Crowdfunding using BlockChain Technology',
    category: 'Academic Project',
    overview: 'A decentralized crowdfunding platform built on the Ethereum blockchain. It uses smart contracts to ensure that funds are only released when specific project milestones are met, providing maximum security for donors.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts']
  },
  'bank-transaction': {
    title: 'Bank Transaction Monitoring using BlockChain Technology',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A smart contract-based system designed to monitor bank transactions in real-time, identifying and flagging suspicious activities through predefined criteria on the Ethereum network. The system ensures transparency and security while providing a robust auditing trail for regulatory authorities.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Real-time Monitoring:</strong> Developed smart contracts to monitor every bank transaction and flag activities meeting suspicious criteria.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Suspicious Activity Detection:</strong> Implemented criteria including threshold values, irregular timing/location, and association with known criminal activity.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Automated Response:</strong> System immediately freezes accounts and triggers notifications to relevant authorities upon detection of suspicious behavior.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Immutable Ledger:</strong> Maintains a tamper-proof, private ledger of all transactions and alerts for auditing by authorized agencies.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Blockchain:</strong> Ethereum Network</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Solidity</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Execution Environment:</strong> Ethereum Virtual Machine (EVM)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Integration:</strong> APIs for bank transaction process interaction</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Notifications:</strong> SMTP, SMS, and Push Notification protocols</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Storage:</strong> Private Blockchain Ledger</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: '#',
    document: 'https://www.linkedin.com/posts/syedirfanx_anti-money-laundering-activity-7142918122277109762-ZvoR?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB94B5gBvPGzSjUVU9CJ7qkji92F0C7hplQ',
    tags: ['Blockchain', 'FinTech', 'Smart Contracts']
  },
  'smart-door-lock': {
    title: 'Smart Door Lock (2FA)',
    category: 'Academic Project',
    overview: 'An IoT-based security solution that combines hardware (Arduino/Raspberry Pi) with a mobile application. It implements two-factor authentication for physical access control, enhancing home and office security.',
    collaborators: ['Syed Irfan', 'IoT Team'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['IoT', 'Security', '2FA', 'Embedded Systems']
  },
  'traffic-monitor': {
    title: 'Traffic Monitor App',
    category: 'Academic Project',
    overview: 'A computer vision-based Android mobile application developed in Java. It analyzes real-time traffic camera feeds to detect vehicles, estimate flow rates, and identify congestion points for urban traffic management.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['CV', 'Mobile App', 'Android', 'Java']
  },
  'machine-overheat': {
    title: 'Machine Overheat Detection',
    category: 'Academic Project',
    overview: 'An industrial monitoring system that uses temperature sensors and predictive logic to detect potential machinery overheating. It provides real-time alerts to prevent hardware damage and downtime.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Embedded Systems', 'Industrial IoT', 'Sensors']
  },
  'study-theatre': {
    title: 'Study Theatre',
    category: 'Industrial Project',
    overview: 'A collaborative mobile application for students built with Flutter. It facilitates organized resource sharing, group study scheduling, and real-time academic collaboration.',
    collaborators: ['Syed Irfan', 'Mobile Dev Team'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Mobile App Dev', 'Flutter', 'Collaboration', 'Education Tech']
  },
  'digital-logic': {
    title: 'Digital Logic Design',
    category: 'Academic Project',
    overview: 'Implementation and simulation of fundamental digital circuits. This project involved designing complex logic gates, flip-flops, and counters to understand the core architecture of modern computing.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Hardware', 'Circuit Design', 'Digital Logic']
  },
  'whack-a-mole': {
    title: 'Whack A Mole',
    category: 'Academic Project',
    overview: 'A classic arcade game implementation. This project focused on mastering event-driven programming, timing logic, and responsive UI design in a browser environment.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Game Dev', 'JavaScript', 'UI/UX']
  },
  'synthetic-face': {
    title: 'Synthetic Face Generation using GAN',
    category: 'Academic Project',
    overview: 'An exploration into Generative Adversarial Networks (GANs). This project focuses on training models to generate high-fidelity, non-existent human faces with controllable attributes like age and expression.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['GANs', 'Deep Learning', 'Generative AI']
  },
  'valentines-data': {
    title: 'Valentine\'s Day Consumer Data Analysis',
    category: 'Personal Project',
    overview: 'A data science project that analyzes consumer spending habits during the Valentine\'s season. It uses sentiment analysis and trend forecasting to identify market patterns and consumer behavior.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Data Science', 'Sentiment Analysis', 'Market Trends']
  },
  'file-organizer': {
    title: 'Auto File Organizer',
    category: 'Personal Project',
    overview: 'A Python-based utility that automatically categorizes and moves files based on their extensions and content. It includes real-time directory monitoring and detailed logging of all file operations.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Automation', 'Python', 'Productivity']
  },
  'bangla-newspaper-summarizer': {
    title: 'Bangla Newspaper Image Summarizer',
    category: 'Personal Project',
    overview: 'An AI-powered tool that processes images of Bangla newspapers using OCR to extract text and generate concise summaries. It helps users quickly digest news from physical or digital newspaper clippings.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['OCR', 'NLP', 'Bangla AI', 'Summarization']
  },
  'news-aggregator': {
    title: 'News Aggregator Service',
    category: 'Industrial Project',
    overview: 'A personalized news service that scrapes multiple sources, categorizes articles using NLP, and provides concise summaries using the LexRank algorithm.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['NLP', 'Web Scraping', 'Summarization']
  },
  'shell-lubricants': {
    title: 'Shell Lubricants E-commerce App',
    category: 'Industrial Project',
    overview: 'A robust e-commerce mobile application developed for Shell Lubricants using Flutter. The app features a streamlined product catalog, secure checkout, and real-time order tracking tailored for industrial and consumer lubricant sales.',
    collaborators: ['Syed Irfan', 'Development Team'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Mobile App Dev', 'Flutter', 'E-commerce', 'Industrial']
  },
  'greenwich': {
    title: 'Master of Science (MSc) in Data Science',
    category: 'Academic Background',
    tags: [],
    overview: `
      <div class="space-y-6">
        <div>
          <p class="text-zinc-500 text-sm font-mono uppercase tracking-widest mt-1">University of Greenwich • London, UK</p>
        </div>
        <div>
          <p class="text-zinc-400 text-sm leading-relaxed">A comprehensive program focusing on advanced data analysis, machine learning, and their applications in the financial sector.</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">MSc Project</p>
          <div class="flex justify-between text-sm text-zinc-300">
            <span>Feature Selection using Swarm Intelligence Techniques</span>
            <span class="text-zinc-600">60cr</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pt-2">
          <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest col-span-full mb-2">Core Modules</p>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Applied Machine Learning</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Big Data</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Blockchain for FinTech</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Data Visualisation</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Machine Learning</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Programming Fundamentals</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Statistical Methods</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>AML & Financial Crime</span><span class="text-zinc-600">15cr</span></div>
        </div>
      </div>
    `
  },
  'nsu': {
    title: 'Bachelor of Science (BSc) in Computer Science & Engineering',
    category: 'Academic Background',
    tags: [],
    overview: `
      <div class="space-y-6">
        <div>
          <p class="text-zinc-500 text-sm font-mono uppercase tracking-widest mt-1">North South University • Dhaka, Bangladesh</p>
        </div>
        <div>
          <p class="text-zinc-400 text-sm leading-relaxed">Specialized in Artificial Intelligence, focusing on neural networks, pattern recognition, and software engineering.</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3">
          <div>
            <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Thesis</p>
            <p class="text-zinc-300 text-sm">Generating Faces from Fingerprints using Artificial Neural Networks</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Senior Project</p>
              <p class="text-zinc-300 text-sm">Smart Door Lock System</p>
            </div>
            <div>
              <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Junior Project</p>
              <p class="text-zinc-300 text-sm">Traffic Monitor Android App</p>
            </div>
          </div>
        </div>
        <div class="pt-2">
          <p class="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Key Coursework</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Data Structures & Algorithms</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Machine Learning</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Pattern Recognition</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Neural Networks</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Operating Systems</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Database Systems</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Software Engineering</span>
          </div>
        </div>
      </div>
    `
  }
};

let currentCategory = 'all';
let currentStack = 'all';
let searchQuery = '';

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const filteredProjects = Object.entries(projectsData).filter(([id, project]) => {
    // Skip academic background items in the research grid
    if (id === 'greenwich' || id === 'nsu') return false;

    const tags = project.tags || [];

    // Category Filter
    const matchesCategory = currentCategory === 'all' || 
                           (currentCategory === 'Conference Paper' && (project.category === 'Conference Paper' || project.category === 'Publication and conference paper')) ||
                           (currentCategory === 'Academic Project' && (project.category === 'Academic Project' || project.category === 'Thesis Research' || project.category === 'MSc Thesis')) ||
                           (currentCategory === 'Personal Innovation' && (project.category === 'Personal Innovation' || project.category === 'Personal Project')) ||
                           project.category === currentCategory;
    
    // Stack Filter
    const matchesStack = currentStack === 'all' || 
                        tags.some(tag => tag.toLowerCase().includes(currentStack.toLowerCase())) ||
                        (currentStack === 'AI/ML/Data Science' && tags.some(tag => ['AI', 'ML', 'Deep Learning', 'CNN', 'GANs', 'Data Science', 'Machine Learning', 'Sentiment Analysis'].some(t => tag.includes(t)))) ||
                        (currentStack === 'Web/Mobile App Dev' && tags.some(tag => ['Web', 'Full Stack', 'Backend', 'Mobile', 'Flutter', 'Android', 'iOS'].some(t => tag.includes(t))));

    // Search Filter (Advanced: includes category)
    const searchContent = `${project.title} ${project.overview} ${project.category} ${tags.join(' ')}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStack && matchesSearch;
  });

  if (filteredProjects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-20 text-center">
        <p class="text-zinc-500 text-lg">No projects found matching your criteria.</p>
        <button onclick="resetFilters()" class="mt-4 text-white hover:underline text-sm">Reset all filters</button>
      </div>
    `;
    return;
  }

  filteredProjects.forEach(([id, project]) => {
    const card = document.createElement('div');
    card.className = 'grok-card p-8 rounded-2xl flex flex-col group hover:border-zinc-700 transition-all cursor-pointer';
    card.onclick = () => openProjectModal(id);
    
    card.innerHTML = `
      <div class="flex justify-between items-start mb-6">
        <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">${project.category}</span>
      </div>
      <h3 class="text-xl font-bold mb-3">${project.title}</h3>
      <div class="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors mb-6 uppercase tracking-widest">
        <span>See details</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
      <div class="mt-auto flex flex-wrap gap-2">
        ${project.tags.slice(0, 2).map(tag => `
          <span class="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest border border-zinc-800">${tag}</span>
        `).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterByCategory(category) {
  currentCategory = category;
  renderProjects();
}

function selectCategory(category, label) {
  currentCategory = category;
  document.getElementById('category-label').innerText = `Category: ${label}`;
  document.getElementById('category-menu').classList.add('hidden');
  updateResetButton();
  renderProjects();
}

function filterByStack(stack) {
  currentStack = stack;
  renderProjects();
}

function selectStack(stack, label) {
  currentStack = stack;
  document.getElementById('stack-label').innerText = `Stack: ${label}`;
  document.getElementById('stack-menu').classList.add('hidden');
  updateResetButton();
  renderProjects();
}

function toggleDropdown(id) {
  const menu = document.getElementById(id);
  const isHidden = menu.classList.contains('hidden');
  
  // Close all other dropdowns
  document.querySelectorAll('[id$="-menu"]').forEach(m => m.classList.add('hidden'));
  
  if (isHidden) {
    menu.classList.remove('hidden');
  }
}

function updateResetButton() {
  const btn = document.getElementById('reset-filters-btn');
  if (currentCategory !== 'all' || currentStack !== 'all' || searchQuery !== '') {
    btn.classList.remove('hidden');
    btn.classList.add('flex');
  } else {
    btn.classList.add('hidden');
    btn.classList.remove('flex');
  }
}

function resetFilters() {
  currentCategory = 'all';
  currentStack = 'all';
  searchQuery = '';
  
  const searchInput = document.getElementById('project-search');
  if (searchInput) searchInput.value = '';
  
  document.getElementById('category-label').innerText = 'Category: All';
  document.getElementById('stack-label').innerText = 'Stack: All';
  
  updateResetButton();
  renderProjects();
}

// Close dropdowns on click outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.group')) {
    document.querySelectorAll('[id$="-menu"]').forEach(m => m.classList.add('hidden'));
  }
});

// Initialize Search
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('project-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateResetButton();
      renderProjects();
    });
  }
  
  // Initial render
  renderProjects();
});

function openProjectModal(projectId) {
  const project = projectsData[projectId];
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  
  // Push state for back button support
  if (!history.state || history.state.modal !== 'project') {
    history.pushState({ modal: 'project' }, '');
  }

  document.getElementById('modal-title').innerText = project.title;
  
  const categoryLabel = document.getElementById('modal-category');
  if (project.category) {
    categoryLabel.innerText = project.category;
    categoryLabel.classList.remove('hidden');
  } else {
    categoryLabel.classList.add('hidden');
  }

  document.getElementById('modal-overview').innerHTML = project.overview;
  
  const collaboratorsContainer = document.getElementById('modal-collaborators');
  const collaboratorsSection = collaboratorsContainer.parentElement;
  
  const githubLink = document.getElementById('modal-github');
  const documentLink = document.getElementById('modal-document');
  const linksSection = githubLink ? githubLink.parentElement.parentElement : null;
  
  const tagsContainer = document.getElementById('modal-tags');
  const metaGrid = collaboratorsSection ? collaboratorsSection.parentElement : null;

  // Handle Collaborators
  if (collaboratorsSection && project.collaborators && project.collaborators.length > 0) {
    collaboratorsSection.classList.remove('hidden');
    collaboratorsContainer.innerHTML = project.collaborators.map(c => `<div>${c}</div>`).join('');
  } else if (collaboratorsSection) {
    collaboratorsSection.classList.add('hidden');
  }

  // Handle Links
  if (linksSection && (project.github || project.document)) {
    linksSection.classList.remove('hidden');
    if (githubLink) {
      githubLink.onclick = null; // Reset
      githubLink.removeAttribute('target'); // Reset
      if (project.github === 'closed') {
        githubLink.href = 'javascript:void(0)';
        githubLink.onclick = (e) => {
          e.preventDefault();
          showToast('This repository is closed source and not publicly available.', 'Repository Access');
        };
        githubLink.classList.remove('hidden');
      } else if (project.github && project.github !== '#') {
        githubLink.href = project.github;
        githubLink.setAttribute('target', '_blank');
        githubLink.classList.remove('hidden');
      } else {
        githubLink.classList.add('hidden');
      }
    }
    if (documentLink) {
      documentLink.onclick = null; // Reset
      documentLink.removeAttribute('target'); // Reset
      if (project.document === 'private') {
        documentLink.href = 'javascript:void(0)';
        documentLink.onclick = (e) => {
          e.preventDefault();
          showToast('This documentation is private and not available publicly.', 'Document Access');
        };
        documentLink.classList.remove('hidden');
      } else if (project.document && project.document !== '#') {
        documentLink.href = project.document;
        documentLink.setAttribute('target', '_blank');
        documentLink.classList.remove('hidden');
      } else {
        documentLink.classList.add('hidden');
      }
    }
    
    // If both links are hidden after checking values
    if (githubLink && documentLink && githubLink.classList.contains('hidden') && documentLink.classList.contains('hidden')) {
      linksSection.classList.add('hidden');
    }
  } else if (linksSection) {
    linksSection.classList.add('hidden');
  }

  // Handle Tags
  if (tagsContainer) {
    if (project.tags && project.tags.length > 0) {
      tagsContainer.classList.remove('hidden');
      tagsContainer.innerHTML = project.tags.map(tag => `
        <span class="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest border border-zinc-800">${tag}</span>
      `).join('');
    } else {
      tagsContainer.classList.add('hidden');
    }
  }

  // Hide Meta Grid if both sub-sections are hidden
  if (metaGrid && collaboratorsSection && linksSection) {
    if (collaboratorsSection.classList.contains('hidden') && linksSection.classList.contains('hidden')) {
      metaGrid.classList.add('hidden');
    } else {
      metaGrid.classList.remove('hidden');
    }
  }

  modal.classList.remove('hidden');
  setTimeout(() => {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 10);
  
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(fromPopState = false) {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  if (!modal || modal.classList.contains('hidden')) return;
  
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 300);

  // If closed via UI (not back button), and state exists, go back
  if (!fromPopState && history.state && history.state.modal === 'project') {
    history.back();
  }
}

// Global Popstate Listener for Back Button Support
window.addEventListener('popstate', (event) => {
  // Hide loader if it was shown
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('hidden');

  // Close any open modals or menus when back button is pressed
  closeProjectModal(true);
  closeMobileMenu(true);
  
  // Also handle gallery modal if it exists (defined in favorites.html)
  if (typeof closeGallery === 'function') {
    closeGallery(true);
  }
});

// Wishes Spot Logic
async function initWishes() {
  const wishesSpot = document.getElementById('wishes-spot');
  const wishTitle = document.getElementById('wish-title');
  const wishMessage = document.getElementById('wish-message');
  
  if (!wishesSpot || !wishTitle || !wishMessage) return;

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayOfWeek = now.getDay();

  const startCycling = (title, message) => {
    // Detect if text is Bangla (Bengali script range: \u0980-\u09FF)
    const isBangla = /[\u0980-\u09FF]/.test(title) || /[\u0980-\u09FF]/.test(message);
    
    if (isBangla) {
      wishTitle.classList.add('font-bangla');
      wishMessage.classList.add('font-bangla');
    } else {
      wishTitle.classList.remove('font-bangla');
      wishMessage.classList.remove('font-bangla');
    }

    wishTitle.textContent = title;
    wishMessage.textContent = message;
    wishesSpot.classList.remove('hidden');

    // Particle Spawning Logic
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
      setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const x = Math.random() * 100;
        const y = 50 + Math.random() * 50; // Start from bottom half
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        // Brighter, more saturated colors
        const color = `hsl(${Math.random() * 360}, 90%, 80%)`;
        particle.style.background = color;
        particle.style.color = color; // For box-shadow currentColor
        particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
      }, 200); // Faster spawning
    }

    // Calculate the width needed for the longest text
    setTimeout(() => {
      const titleWidth = wishTitle.scrollWidth;
      const messageWidth = wishMessage.scrollWidth;
      const maxWidth = Math.max(titleWidth, messageWidth) + 4;
      if (wishTitle.parentElement) {
        wishTitle.parentElement.style.width = `${maxWidth}px`;
      }
    }, 50);

    let isTitle = true;
    setInterval(() => {
      isTitle = !isTitle;
      if (isTitle) {
        wishTitle.classList.remove('opacity-0', '-translate-x-4', 'blur-sm');
        wishMessage.classList.add('opacity-0', 'translate-x-4', 'blur-sm');
      } else {
        wishTitle.classList.add('opacity-0', '-translate-x-4', 'blur-sm');
        wishMessage.classList.remove('opacity-0', 'translate-x-4', 'blur-sm');
      }
    }, 4000);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  // 1. Check Fixed National/International Days
  const fixedDays = [
    { month: 4, day: 13, title: "শুভ নববর্ষ!🏵️", message: "সবাইকে বাংলা নববর্ষের শুভেচ্ছা। 🐯" },
    { month: 2, day: 21, title: "Happy International Mother Language Day", message: "Remembering the Language Martyrs." },
    { month: 3, day: 26, title: "Happy Independence Day", message: "Celebrating freedom and unity" },
    { month: 4, day: 14, title: "শুভ নববর্ষ!🏵️", message: "সবাইকে বাংলা নববর্ষের শুভেচ্ছা। 🐯" },
    { month: 12, day: 16, title: "Happy Victory Day", message: "May the red and green flag always fly high with pride" }
  ];

  // Special Check: Happy New Year (First 10 days of January)
  if (month === 1 && day <= 10) {
    startCycling(`Happy New Year ${now.getFullYear()}! ✨`, "Wishing you a year full of joy, peace, and success.");
    return;
  }

  const todayFixed = fixedDays.find(d => d.month === month && d.day === day);
  if (todayFixed) {
    startCycling(todayFixed.title, todayFixed.message);
    return;
  }

  // 2. Check for Eid (Automatic via Aladhan API)
  try {
    const formattedDate = `${day}-${month}-${now.getFullYear()}`;
    const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${formattedDate}`);
    const data = await response.json();
    
    if (data.code === 200) {
      const hijri = data.data.hijri;
      const hDay = parseInt(hijri.day);
      const hMonth = hijri.month.number;

      if (hMonth === 10 && (hDay === 1 || hDay === 2 || hDay === 3)) {
        startCycling("Eid Mubarak", "Wishing you a blessed Eid. ✨");
        return;
      }
      
      if (hMonth === 12 && (hDay === 10 || hDay === 11 || hDay === 12)) {
        startCycling("Eid Mubarak", "Wishing you a blessed Eid. ✨");
        return;
      }
    }
  } catch (error) {
    console.error("Failed to fetch Hijri date:", error);
  }

  // 3. Check for Jummah (Friday)
  if (dayOfWeek === 5) {
    startCycling("Jummah Mubarak", "Have a blessed Friday. ✨");
    return;
  }

  wishesSpot.classList.add('hidden');
}
