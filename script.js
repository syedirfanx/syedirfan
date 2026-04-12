// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
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
});

// Mobile Menu Logic
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuBtn || !mobileMenu) {
    console.warn('Mobile menu elements not found');
    return;
  }

  const openMenu = (e) => {
    if (e) e.preventDefault();
    mobileMenu.classList.remove('hidden');
    mobileMenu.style.display = 'flex'; // Force display flex
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.style.display = 'none'; // Force display none
    document.body.style.overflow = 'auto';
  };

  menuBtn.addEventListener('click', openMenu);

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
  }

  // Close menu on link click
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
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
    title: 'Rice Leaf Disease Detection Using Machine Learning Techniques',
    category: 'Conference Paper',
    overview: 'This research co-authored a conference paper presenting findings on rice leaf disease detection. We utilized machine learning algorithms to achieve a testing accuracy of 97.92%. The study involved rigorous evaluation using TPR, FPR, Precision, and AUC metrics to ensure the model\'s reliability in an agricultural context.',
    collaborators: ['Syed Irfan', 'Research Team at North South University'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Machine Learning', 'Agriculture AI', 'Data Analysis']
  },
  'swarm-intelligence': {
    title: 'Feature Selection using Swarm Intelligence',
    category: 'Thesis Research',
    overview: 'My thesis research focuses on decentralized optimization algorithms to enhance feature selection in high-dimensional datasets. By mimicking the collective behavior of social insects, we aim to improve model accuracy while significantly reducing computational overhead.',
    collaborators: ['Syed Irfan', 'Academic Supervisors'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Optimization', 'Swarm Intelligence', 'Python', 'Feature Selection']
  },
  'starpals-ai': {
    title: 'StarPals AI',
    category: 'Industrial Project',
    overview: 'StarPals AI is a cutting-edge film casting platform. It utilizes Generative AI, Natural Language Processing, and Multi-Modal Learning to facilitate actor profiling, lookalike detection, and precise role-matching for the entertainment industry.',
    collaborators: ['Syed Irfan (Lead Developer)', 'StarPals Team'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Gen AI', 'NLP', 'Multi-Modal', 'Python']
  },
  'face-mask-detector': {
    title: 'Face Mask Detector',
    category: 'Industrial Project',
    overview: 'Developed a real-time face mask detection system using Convolutional Neural Networks (CNN). The model achieved 95% accuracy and was designed for deployment in public spaces to assist with safety compliance monitoring.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Computer Vision', 'CNN', 'TensorFlow', 'Real-time']
  },
  'id-card-ocr': {
    title: 'ID Card OCR System',
    category: 'Industrial Project',
    overview: 'An advanced OCR pipeline designed to extract both Bangla and English text from National ID cards. The system processes images to output structured JSON data, facilitating automated data entry for financial and governmental services.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['OCR', 'NLP', 'Bangla OCR', 'Python']
  },
  'rice-leaf-disease': {
    title: 'Rice Leaf Disease Detection',
    category: 'Academic Project',
    overview: 'A deep learning project aimed at supporting agriculture. Using CNNs, the system identifies various rice leaf diseases from images, providing early diagnosis to help farmers mitigate crop loss.',
    collaborators: ['Syed Irfan', 'University Project Team'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Deep Learning', 'Agriculture AI', 'CNN']
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
    title: 'Secure Crowdfunding (Blockchain)',
    category: 'Academic Project',
    overview: 'A decentralized crowdfunding platform built on the Ethereum blockchain. It uses smart contracts to ensure that funds are only released when specific project milestones are met, providing maximum security for donors.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts']
  },
  'bank-transaction': {
    title: 'Bank Transaction Monitor',
    category: 'Academic Project',
    overview: 'A distributed ledger system designed for real-time monitoring and auditing of financial transactions. It leverages blockchain technology to prevent fraud and ensure data integrity in banking operations.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Blockchain', 'FinTech', 'Distributed Systems']
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
    overview: 'A computer vision application that analyzes real-time traffic camera feeds. It detects vehicles, estimates flow rates, and identifies congestion points to assist in urban traffic management.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['CV', 'Traffic Management', 'Real-time']
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
    category: 'Academic Project',
    overview: 'A web-based collaborative platform for students. It allows for organized resource sharing, group study scheduling, and real-time collaboration on academic projects.',
    collaborators: ['Syed Irfan', 'Web Dev Team'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Web Development', 'Collaboration', 'Education Tech']
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
    title: 'Synthetic Face Generation',
    category: 'Personal Innovation',
    overview: 'An exploration into Generative Adversarial Networks (GANs). This project focuses on training models to generate high-fidelity, non-existent human faces with controllable attributes like age and expression.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['GANs', 'Deep Learning', 'Generative AI']
  },
  'valentines-data': {
    title: 'Consumer Data Analysis',
    category: 'Personal Innovation',
    overview: 'A data science project that analyzes consumer spending habits during the Valentine\'s season. It uses sentiment analysis and trend forecasting to identify market patterns and consumer behavior.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Data Science', 'Sentiment Analysis', 'Market Trends']
  },
  'file-organizer': {
    title: 'Auto File Organizer',
    category: 'Personal Innovation',
    overview: 'A Python-based utility that automatically categorizes and moves files based on their extensions and content. It includes real-time directory monitoring and detailed logging of all file operations.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['Automation', 'Python', 'Productivity']
  },
  'news-aggregator': {
    title: 'News Aggregator Service',
    category: 'Personal Innovation',
    overview: 'A personalized news service that scrapes multiple sources, categorizes articles using NLP, and provides concise summaries using the LexRank algorithm.',
    collaborators: ['Syed Irfan'],
    github: 'https://github.com/syedirfanx',
    document: '#',
    tags: ['NLP', 'Web Scraping', 'Summarization']
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
                           (currentCategory === 'Conference Paper' && (project.category === 'Conference Paper' || project.category === 'Thesis Research')) ||
                           project.category === currentCategory;
    
    // Stack Filter
    const matchesStack = currentStack === 'all' || 
                        tags.some(tag => tag.toLowerCase().includes(currentStack.toLowerCase())) ||
                        (currentStack === 'Machine Learning' && tags.some(tag => ['AI', 'ML', 'Deep Learning', 'CNN', 'GANs'].some(t => tag.includes(t)))) ||
                        (currentStack === 'Web Development' && tags.some(tag => ['Web', 'Full Stack', 'Backend'].some(t => tag.includes(t))));

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
  const linksSection = githubLink.parentElement.parentElement;
  
  const tagsContainer = document.getElementById('modal-tags');
  const metaGrid = collaboratorsSection.parentElement;

  // Handle Collaborators
  if (project.collaborators && project.collaborators.length > 0) {
    collaboratorsSection.classList.remove('hidden');
    collaboratorsContainer.innerHTML = project.collaborators.map(c => `<div>${c}</div>`).join('');
  } else {
    collaboratorsSection.classList.add('hidden');
  }

  // Handle Links
  if (project.github || project.document) {
    linksSection.classList.remove('hidden');
    if (project.github && project.github !== '#') {
      githubLink.href = project.github;
      githubLink.classList.remove('hidden');
    } else {
      githubLink.classList.add('hidden');
    }
    if (project.document && project.document !== '#') {
      documentLink.href = project.document;
      documentLink.classList.remove('hidden');
    } else {
      documentLink.classList.add('hidden');
    }
    
    // If both links are hidden after checking values
    if (githubLink.classList.contains('hidden') && documentLink.classList.contains('hidden')) {
      linksSection.classList.add('hidden');
    }
  } else {
    linksSection.classList.add('hidden');
  }

  // Handle Tags
  if (project.tags && project.tags.length > 0) {
    tagsContainer.classList.remove('hidden');
    tagsContainer.innerHTML = project.tags.map(tag => `
      <span class="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest border border-zinc-800">${tag}</span>
    `).join('');
  } else {
    tagsContainer.classList.add('hidden');
  }

  // Hide Meta Grid if both sub-sections are hidden
  if (collaboratorsSection.classList.contains('hidden') && linksSection.classList.contains('hidden')) {
    metaGrid.classList.add('hidden');
  } else {
    metaGrid.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
  setTimeout(() => {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 10);
  
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 300);
}
