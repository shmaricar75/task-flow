/**
 * TaskFlow — Modern Task Manager Landing Page
 * Interactive Behaviors, Live Preview Widget, Form Validation & Responsive Nav
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sticky Navbar & Header Scroll State
     ========================================================================== */
  const header = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ==========================================================================
     2. Responsive Mobile Drawer Navigation
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Close mobile drawer when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close when clicking outside the navMenu
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      toggleMenu();
    }
  });


  /* ==========================================================================
     3. Active Nav Link on Scroll (Intersection Observer)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));


  /* ==========================================================================
     4. Interactive Live Task Demo Widget
     ========================================================================== */
  const taskListEl = document.getElementById('taskList');
  const progressPercentEl = document.getElementById('progressPercent');
  const progressFillEl = document.getElementById('progressFill');
  const quickAddForm = document.getElementById('quickAddForm');
  const quickTaskInput = document.getElementById('quickTaskInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const countAll = document.getElementById('countAll');
  const countPending = document.getElementById('countPending');
  const countCompleted = document.getElementById('countCompleted');

  // Initial Demo Tasks
  let tasks = [
    { id: 1, title: 'Finalize Task Manager Landing Page UI', priority: 'high', priorityLabel: 'High', time: '09:30 AM', completed: true },
    { id: 2, title: 'Review product requirements with client', priority: 'medium', priorityLabel: 'Medium', time: '11:00 AM', completed: true },
    { id: 3, title: 'Deploy live static site to GitHub Pages', priority: 'urgent', priorityLabel: 'Urgent', time: '02:30 PM', completed: false }
  ];

  let currentFilter = 'all';

  // Recalculate and update progress bar
  const updateProgress = () => {
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = total - completedCount;
    const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

    progressPercentEl.textContent = `${percent}%`;
    progressFillEl.style.width = `${percent}%`;

    countAll.textContent = total;
    countPending.textContent = pendingCount;
    countCompleted.textContent = completedCount;
  };

  // Render Tasks based on filter
  const renderTasks = () => {
    taskListEl.innerHTML = '';

    const filtered = tasks.filter(task => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'task-item';
      emptyLi.style.justifyContent = 'center';
      emptyLi.style.color = 'var(--text-dim)';
      emptyLi.style.fontSize = '0.85rem';
      emptyLi.textContent = currentFilter === 'completed' ? 'No completed tasks yet.' : 'No active tasks in this view.';
      taskListEl.appendChild(emptyLi);
      return;
    }

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <label class="task-checkbox-label">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
          <span class="custom-checkbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span class="task-title">${escapeHTML(task.title)}</span>
        </label>
        <div class="task-meta">
          <span class="badge badge-${task.priority}">${task.priorityLabel}</span>
          <span class="task-time">${task.time}</span>
        </div>
      `;

      // Checkbox event
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.classList.toggle('completed', task.completed);
        updateProgress();
        if (currentFilter !== 'all') {
          renderTasks();
        }
      });

      taskListEl.appendChild(li);
    });
  };

  // Safe HTML Escaping
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Quick Add Task Form Submit
  quickAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = quickTaskInput.value.trim();
    if (!title) return;

    const priorities = ['urgent', 'high', 'medium'];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const priorityLabels = { urgent: 'Urgent', high: 'High', medium: 'Medium' };

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    const newTask = {
      id: Date.now(),
      title,
      priority: randomPriority,
      priorityLabel: priorityLabels[randomPriority],
      time: timeStr,
      completed: false
    };

    tasks.unshift(newTask);
    quickTaskInput.value = '';
    updateProgress();
    renderTasks();
  });

  // Initial Task Render
  updateProgress();
  renderTasks();


  /* ==========================================================================
     5. FAQ Accordion
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all answers
      faqQuestions.forEach(otherBtn => {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherBtn.nextElementSibling.style.maxHeight = null;
      });

      // Toggle clicked
      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ==========================================================================
     6. Contact & Early Access Form Validation & Toast Feedback
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const toastMessage = document.getElementById('toastMessage');
  const submitBtn = document.getElementById('submitBtn');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    nameInput.parentElement.classList.remove('has-error');
    emailInput.parentElement.classList.remove('has-error');
    messageInput.parentElement.classList.remove('has-error');

    // Name Validation
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      nameInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Email Validation
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      emailInput.parentElement.classList.add('has-error');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email format (e.g. name@domain.com).';
      emailInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Message Validation
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please describe your requirements or frustration.';
      messageInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Simulating Submission
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Reserving spot...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();

      // Show toast
      toastMessage.classList.add('show');

      // Hide toast after 6 seconds
      setTimeout(() => {
        toastMessage.classList.remove('show');
      }, 6000);
    }, 800);
  });

});
