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
  'network-flow-optimization': {
    title: 'AI Network Flow Prediction and Resource Optimization',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>An intelligent system designed to predict dynamic network traffic patterns and proactively allocate resources. This project addresses the reactive nature of traditional network systems by implementing a machine learning-based framework for predictive optimization.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Highlights</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Traffic Prediction:</strong> Implemented a Random Forest Regressor to estimate future network congestion with high precision.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Dynamic Resource Allocation:</strong> Developed a rule-based decision engine for load-adaptive routing and scaling.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Research Significance:</strong> Demonstrates proactive optimization in SDN, Network Traffic Engineering, and AI-driven communication systems.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">AI/ML:</strong> Random Forest Regressor, Scikit-learn</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">NetOps:</strong> Traffic Engineering & Resource Simulation</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Data Processing:</strong> Python, Pandas, NumPy</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Visualization:</strong> Matplotlib</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/ai-network-traffic-optimization',
    document: 'https://github.com/syedirfanx/ai-network-traffic-optimization/blob/main/README.md',
    tags: ['AI', 'SDN', 'ML Optimization', 'Network Traffic']
  },
  'face-mask-detector': {
    title: 'Face Mask Detection & Warning Systems',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-6">
        <div class="space-y-4">
          <p>A real-time safety compliance system designed for public and industrial spaces. The platform utilizes deep learning models to detect face mask usage with high precision and trigger automated warnings for non-compliance.</p>
          
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <iframe 
              class="w-full h-full" 
              src="https://www.youtube.com/embed/kOOOnQBQ7Iw" 
              title="Face Mask Detection Showcase" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Real-time Detection:</strong> Developed a high-accuracy system using Convolutional Neural Networks (CNN) to monitor public spaces.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Automated Alerts:</strong> Integrated a warning mechanism that triggers notifications or audio alerts upon detecting non-compliance.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Performance Optimization:</strong> Achieved 95% detection accuracy through extensive model training and optimization for edge deployment.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Deep Learning:</strong> CNN, TensorFlow/Keras</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Computer Vision:</strong> OpenCV</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Deployment:</strong> Real-time Video Stream Processing</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Lead Developer)', 'Sakib Mukter', 'Nafis Faysal'],
    github: 'closed',
    document: '#',
    tags: ['CNN', 'OpenCV', 'Deep Learning']
  },
  'id-card-ocr': {
    title: 'NID Card OCR System (Bangla & English)',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-4">
        <p>An advanced OCR pipeline designed to extract both Bangla and English text from National ID cards. The system processes images to output structured JSON data, facilitating automated data entry for financial and governmental services.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Multi-Language Extraction:</strong> Developed a robust pipeline for extracting both Bangla and English text from complex National ID layouts.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Structured Data Output:</strong> Implemented post-processing logic to convert raw OCR text into structured JSON format for seamless integration.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Preprocessing Pipeline:</strong> Integrated image enhancement techniques to improve OCR accuracy on low-quality scans and photos.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">OCR Engine:</strong> Tesseract OCR</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Image Processing:</strong> OpenCV</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Data Formatting:</strong> JSON Serialization</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Lead Developer)', 'Nafis Faysal'],
    github: 'closed',
    document: '#',
    tags: ['OCR', 'Tesseract', 'python']
  },
  'flight-booking': {
    title: 'Flight Booking System',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A comprehensive web-based flight management system developed for the CSE 311 Database Systems course (Spring 2020). The platform facilitates seamless flight discovery, real-time status tracking, and secure reservation management through a robust relational database backend.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">User Management:</strong> Implemented secure user registration and login systems to manage passenger profiles and booking history.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Flight Discovery:</strong> Developed advanced search functionality allowing users to find flights based on specific criteria and check real-time flight status.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Reservation System:</strong> Built a complete booking workflow from seat selection to final reservation, ensuring data consistency across the flight database.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Backend:</strong> PHP</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Database:</strong> MySQL</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Frontend:</strong> HTML5 & CSS3</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Architecture:</strong> Relational Database Design</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Project Lead)', 'Nafis Faysal', 'Tamanna Rahman'],
    github: 'https://github.com/syedirfanx/FlightBooking',
    document: '#',
    tags: ['Full Stack', 'Database Systems', 'PHP']
  },
  'crowdfunding': {
    title: 'Secure Crowdfunding using BlockChain Technology',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A decentralized crowdfunding solution addressing accountability issues through Ethereum-based Smart Contracts. The system integrates ERC-20 tokens to ensure transparent, secure, and interchangeable fund management across the ecosystem.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">ERC-20 Integration:</strong> Utilized standard fungible tokens for uniform and interchangeable transactions, securing the funding process.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">P2P Trading:</strong> Developed a decentralized peer-to-peer platform allowing direct investment and funding without intermediaries, reducing costs.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Smart Contract Functions:</strong> Implemented core ERC-20 functions (transfer, approve, transferFrom, allowance) to handle secure balance updates and authorized transfers.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technical Implementation</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Smart Contracts:</strong> Solidity with OpenZeppelin libraries</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Blockchain:</strong> Ethereum (EVM-based)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Tools:</strong> Remix IDE, Metamask, Web3 Applications</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Key Features:</strong> Balance tracking, token sale/buy logic, and automated authorization checks.</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Georgios Samakovitis'],
    github: 'closed',
    document: 'https://media.licdn.com/dms/document/media/v2/D4E1FAQE8MvVzlg7RRw/feedshare-document-pdf-analyzed/feedshare-document-pdf-analyzed/0/1702928307221?e=1776902400&v=beta&t=OBsarsp93QYk-b54VvLOHZyMViA8TTUkD6iSMg1Y1KM',
    tags: ['ERC-20', 'Solidity', 'Ethereum', 'Smart Contracts', 'P2P Trading', 'OpenZeppelin']
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
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Georgios Samakovitis'],
    github: '#',
    document: 'https://media.licdn.com/dms/document/media/v2/D4E1FAQGM6amBkKH2Ww/feedshare-document-pdf-analyzed/feedshare-document-pdf-analyzed/0/1703004327594?e=1776902400&v=beta&t=8vPpNT5_7Zlm8mX2oFmxVtV2eWBKZfpuC8QC1PlGGoY',
    tags: ['Blockchain', 'FinTech', 'Smart Contracts']
  },
  'smart-door-lock': {
    title: 'Smart Door Lock (2FA)',
    category: 'Academic Project',
    overview: 'An advanced IoT-based security system that implements two-factor authentication (2FA) using face recognition and fingerprint scanning. This dual-layer biometric approach significantly increases security for physical access control in homes and offices.',
    collaborators: ['Hassan Kafi (Project Lead)', 'Tauhidur Rahman', '<span class="text-white font-bold">Syed Irfan</span>', 'Syeda Nowrin'],
    github: 'closed',
    document: 'private',
    tags: ['IoT', 'Security', '2FA', 'Embedded Systems']
  },
  'traffic-monitor': {
    title: 'Traffic Monitor App',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>An Android application developed for the CSE 299 Junior Project Design (Fall 2018). It empowers traffic authorities to detect speed limit violations in real-time within sensitive zones using precise GPS tracking.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Zone-Specific Monitoring:</strong> Automated speed detection in sensitive areas like schools, hospitals, mosques, and highways.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">GPS Tracking:</strong> Utilizes real-time location data to calculate vehicle speed and cross-reference with zone speed limits.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Violation Detection:</strong> Automatically flags and records speed violations for traffic management and enforcement.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Platform:</strong> Android Studio</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Java</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Core Services:</strong> Google Maps API & GPS Location Services</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Project Lead)', 'Hassan Kafi', 'Tauhidur Rahman', 'Shadman Sadiq'],
    github: 'https://github.com/syedirfanx/traffic-monitor-app',
    document: '#',
    tags: ['Android', 'Java', 'GPS', 'Mobile App']
  },
  'machine-overheat': {
    title: 'Machine Overheat Detection',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>An Arduino-based industrial monitoring system developed for the CSE 323 Operating Systems Design (Fall 2018) course. It provides real-time detection of machinery overheating in industrial environments where visual monitoring is insufficient.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Industrial Monitoring:</strong> Designed for factories with heavy machinery to detect thermal anomalies invisible to the naked eye.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Predictive Maintenance:</strong> Triggers immediate alerts upon detecting dangerous temperature thresholds, ensuring machines operate within safe thermal limits.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Operational Efficiency:</strong> Helps maintain peak performance and prevents hardware damage or downtime by ensuring consistent thermal regulation.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Hardware:</strong> Arduino Board & Temperature Sensors</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Monitoring:</strong> Real-time Serial Feedback</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Integration:</strong> Alert & Maintenance Workflow logic</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Project Lead)', 'Sazzad Hossain Risad', 'Ahsanul Kabir'],
    github: 'https://github.com/syedirfanx/machine-overheat-detection',
    document: '#',
    tags: ['Arduino', 'IoT', 'Embedded Systems', 'Sensors']
  },
  'study-theatre': {
    title: 'Study Theatre',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-4">
        <p>A specialized mobile application developed in Flutter that enables teachers to stream live lectures directly to students. The platform focuses on secure, high-quality educational broadcasting with real-time interaction.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Live Streaming:</strong> Facilitates seamless real-time video broadcasting for academic lectures.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Access Control:</strong> Implements a verification system where only paid, verified accounts can access premium lecture content.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Interactive Stream:</strong> Students can ask questions and engage with the lecturer directly during the live session.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Platform:</strong> Android Studio & Flutter</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Dart</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Backend:</strong> Google Firebase</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['Taufiq Rahman', '<span class="text-white font-bold">Syed Irfan</span>', 'Nafis Faysal'],
    github: 'closed',
    document: 'private',
    tags: ['Flutter', 'Dart', 'Firebase', 'Streaming']
  },
  'digital-logic': {
    title: 'Digital Logic Design',
    category: 'Academic Project',
    overview: `
      <div class="space-y-6">
        <div class="space-y-4">
          <p>This project involved the design and simulation of complex digital systems for the CSE 231 Digital Logic Design course. The implementation focuses on combinational and sequential circuit design with rigorous verification.</p>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 theme-photo-shade">
              <img src="projects/dld1.jpg" alt="DLD Circuit 1" class="w-full h-full object-cover" referrerPolicy="no-referrer">
            </div>
            <div class="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 theme-photo-shade">
              <img src="projects/dld2.png" alt="DLD Circuit 2" class="w-full h-full object-cover" referrerPolicy="no-referrer">
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technical Specifications</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Displayed Digits:</strong> Circuitry designed to correctly render the sequence 10864.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Combinational Circuit:</strong> Optimized using Simplified SOP (Sum of Products) expressions.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Counter Arrangement:</strong> Designed for the specific sequence: 1, 5, 7, 9, 13.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Registers:</strong> Implemented using D Flip-flops with dedicated parallel/serial load registers.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Simulation:</strong> Logisim</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/digital-logic-design',
    document: '#',
    tags: ['Logisim', 'Circuit Design', 'Digital Logic']
  },
  'whack-a-mole': {
    title: 'Whack A Mole',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A classic arcade game implementation developed for the CSE 215 Programming Language II course. This project focuses on object-oriented programming, event-driven logic, and UI design within the Java ecosystem.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Event-Driven Gameplay:</strong> Implemented real-time mouse interaction and synchronized timing logic for mole visibility.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">OOP Architecture:</strong> Leveraged Java's object-oriented principles to manage game state, scoring, and UI components.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Java</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['Abdul Ahad Alif', '<span class="text-white font-bold">Syed Irfan</span>', 'Alin Mostafa'],
    github: 'https://github.com/syedirfanx/whack-a-mole',
    document: '#',
    tags: ['Java', 'OOP', 'Game Dev']
  },
  'synthetic-face': {
    title: 'Synthetic Face Generation using GAN',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A Deep Learning project developed for CSE 465 (Spring 2020). The project focuses on designing and training a Deep Convolutional Generative Adversarial Network (DCGAN) to synthesize high-fidelity human faces.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Goal</h4>
          <p class="text-sm text-zinc-400 leading-relaxed">The primary objective was to architect a generator network capable of producing realistic facial images that resemble non-existent celebrities by learning features from a large-scale face dataset.</p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Architecture:</strong> DCGAN</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Deep Learning:</strong> TensorFlow/Keras or PyTorch</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Asaduzzaman Khan'],
    github: 'https://github.com/syedirfanx/face-generation',
    document: '#',
    tags: ['GANs', 'Deep Learning', 'Generative AI', 'DCGAN']
  },
  'valentines-data': {
    title: 'Valentine\'s Day Consumer Data Analysis',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>A data-driven exploration of Valentine’s Day consumer trends, behaviors, and sentiments — uncovering insights from gift preferences to spending patterns using 10 years of National Retail Federation survey data.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Insights</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Spending Disparity:</strong> Analysis revealed that men tend to spend significantly more on flowers than women.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Generational Shifts:</strong> Younger age groups show a preference for flowers, while older consumers shift spending towards greeting cards.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Tech Stack</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Tools:</strong> Python (Pandas, NumPy, Matplotlib, Seaborn)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Environment:</strong> Jupyter Notebook</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/ValentineConsumerTrends',
    document: '#',
    tags: ['Data Science', 'Data Analysis', 'Python', 'Matplotlib']
  },
  'file-organizer': {
    title: 'Auto File Organizer',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>AutoFileOrganizer is a Python-based automated file management system that continuously monitors a folder, organizes files by type and date, and logs all activities in real-time.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Real-time Monitoring:</strong> Active directory watching for instant file organization upon detection.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Structured Storage:</strong> Moves files into a <code>MyFiles/YYYY-MM-DD/EXTENSION/</code> directory structure.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Detailed Logging:</strong> Generates CSV logs containing timestamps, file names, and path history.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Analysis:</strong> Matplotlib (Visualization script)</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/auto-file-organizer',
    document: '#',
    tags: ['Automation', 'Python', 'File Management']
  },
  'bangla-newspaper-summarizer': {
    title: 'Bangla Newspaper Image Summarizer',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>An AI-powered tool designed to automate reading Bangla newspaper images, extracting text via OCR, generating summaries, and securely storing them on Google Drive.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Pipeline Flow</h4>
          <div class="text-[10px] font-mono text-zinc-500 bg-zinc-950 p-4 rounded-xl border border-zinc-800 leading-tight">
            Images (data/) → OCR → Preprocessing → Summarization → Google Drive Upload
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Full Bangla OCR:</strong> High-precision text extraction from scanned newspaper clippings.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Advanced NLP:</strong> LexRank summarization with frequency-based fallback for Bangla text.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Cloud Integration:</strong> Automated uploads of summaries in CSV, JSON, and text formats to Drive.</span>
            </li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/bangla-news-summarizer',
    document: '#',
    tags: ['OCR', 'NLP', 'Bangla AI', 'Summarization', 'LexRank']
  },
  'news-aggregator': {
    title: 'Web Scraping Service',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-4">
        <p>A specialized news data extraction service that scrapes headlines, complete articles, and publication dates from various portals for structured analysis.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Multi-Portal Extraction:</strong> Scrapes news data including headlines, article bodies, and metadata.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Structured Output:</strong> Saves extracted datasets in CSV and JSON formats for analytical portability.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Scraping:</strong> Python, BeautifulSoup, Requests</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Analysis:</strong> Pandas</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Nafis Faysal'],
    github: 'https://github.com/syedirfanx/web-scraping',
    document: '#',
    tags: ['Web Scraping', 'BeautifulSoup', 'Python', 'Data Science']
  },
  'shell-lubricants': {
    title: 'Shell Lubricants E-commerce App',
    category: 'Industrial Project',
    overview: 'A robust e-commerce mobile application developed for Shell Lubricants using Flutter. The app features a streamlined product catalog, secure checkout, and real-time order tracking tailored for industrial and consumer lubricant sales.',
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Ranjit Das', 'Asiful Alam Fahim'],
    github: 'closed',
    document: 'private',
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
