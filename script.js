// =========================================================
// THEME TOGGLE (light / dark mode)
// Theme choice is saved to localStorage so it persists
// across page reloads.
// =========================================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// On load: apply saved theme, default to light if none saved
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});

function applyTheme(theme) {
  if (theme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️'; // sun icon = "click to go light"
  } else {
    htmlElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙'; // moon icon = "click to go dark"
  }
}

// =========================================================
// MOBILE NAVIGATION (hamburger menu)
// =========================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close the mobile menu whenever a nav link is clicked, and smooth-scroll
// to the target section manually (accounts for sticky navbar height so
// the section title isn't hidden underneath it).
const NAVBAR_OFFSET = 70;

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');

    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      const targetTop = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// =========================================================
// SCROLL PROGRESS BAR
// Width reflects how far down the page the user has scrolled.
// =========================================================
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${percent}%`;
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

// =========================================================
// REAL-LIFE SCENARIO FLIP CARDS
// Clicking a card toggles its "flipped" class, which the CSS
// uses to rotate the card and reveal the back face.
// =========================================================
document.querySelectorAll('.scenario-card').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// =========================================================
// COPY-TO-CLIPBOARD BUTTONS ON COMMAND CARDS
// Wraps every <pre> inside a .command-card with a positioned
// button that copies its command text to the clipboard.
// =========================================================
document.querySelectorAll('.command-card pre').forEach((pre) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block';

  const button = document.createElement('button');
  button.className = 'copy-btn';
  button.type = 'button';
  button.textContent = 'Copy';

  button.addEventListener('click', () => {
    const codeText = pre.textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      button.textContent = 'Copied!';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('copied');
      }, 1500);
    });
  });

  // Move the <pre> inside the new wrapper, then append the button
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);
  wrapper.appendChild(button);
});

// =========================================================
// COMMAND DETAILS MODAL
// Each command has a usage/when/how breakdown shown in a
// popup when the student clicks "Learn more" on its card.
// =========================================================
const commandDetails = {
  'git init': {
    usage: 'git init',
    when: 'When starting a brand-new project that isn\'t tracked by Git yet.',
    how: 'Creates a hidden <code>.git</code> folder in the current directory. That folder is where Git stores all history, branches, and settings for the project — nothing is sent anywhere, it stays fully local.',
  },
  'git clone': {
    usage: 'git clone https://github.com/user/repo.git',
    when: 'When you want a full local copy of a project that already exists on GitHub (e.g. joining a team project or copying an open-source repo).',
    how: 'Downloads every file plus the entire commit history from the remote repository, and automatically sets up a connection (called "origin") back to it so you can push/pull later.',
  },
  'git add': {
    usage: 'git add filename.txt\ngit add .',
    when: 'After editing files, right before you want to commit them.',
    how: 'Moves changed files into the "staging area" — a holding zone for changes you\'re about to save. <code>git add .</code> stages every changed file at once; naming a file stages only that one.',
  },
  'git commit': {
    usage: 'git commit -m "Add login page"',
    when: 'Whenever you finish a logical chunk of work and want to save a permanent checkpoint.',
    how: 'Takes everything in the staging area and saves it as a new snapshot in the project history, tagged with your message. Each commit gets a unique ID and can always be returned to later.',
  },
  'git push': {
    usage: 'git push origin main',
    when: 'After committing locally, when you want your changes visible on GitHub (and to teammates).',
    how: 'Uploads your local commits to the named remote ("origin") and branch ("main"). If someone else pushed first, Git will ask you to pull their changes before you can push yours.',
  },
  'git pull': {
    usage: 'git pull origin main',
    when: 'Before starting work each day, or whenever a teammate may have pushed new changes.',
    how: 'Combines <code>git fetch</code> (download new commits) and <code>git merge</code> (combine them into your branch) in one step, bringing your local copy up to date with GitHub.',
  },
  'git branch': {
    usage: 'git branch new-feature',
    when: 'Before starting any new feature, fix, or experiment — so it stays isolated from the stable code.',
    how: 'Creates a new pointer that tracks its own line of commits, starting from wherever you currently are. The main branch is untouched until you explicitly merge the new branch into it.',
  },
  'git checkout': {
    usage: 'git checkout new-feature\ngit switch new-feature',
    when: 'Whenever you need to move your working files to match a different branch.',
    how: 'Updates the files in your folder to match the selected branch\'s latest commit. <code>git switch</code> is the newer, branch-only version of this same idea (checkout can also do other things, like restoring files).',
  },
  'git merge': {
    usage: 'git checkout main\ngit merge new-feature',
    when: 'When a branch\'s work is finished, tested, and ready to be combined back into main.',
    how: 'Takes the commits made on the named branch and weaves them into the branch you\'re currently on. If both branches changed the same lines, Git flags it as a "merge conflict" for you to resolve by hand.',
  },
  'git status': {
    usage: 'git status',
    when: 'Constantly — it\'s the command you\'ll run most while learning Git, any time you\'re unsure what state things are in.',
    how: 'Reads the current state of your working folder and staging area, then reports: which branch you\'re on, which files are modified, which are staged, and which are untracked.',
  },
  'git log': {
    usage: 'git log --oneline',
    when: 'When you need to investigate history — find when a bug was introduced, or see what a teammate changed.',
    how: 'Walks backward through commit history printing each commit\'s ID, author, date, and message. The <code>--oneline</code> flag compresses each entry to a single line for quick scanning.',
  },
  'git remote': {
    usage: 'git remote add origin https://github.com/user/repo.git',
    when: 'When a local repo (made with <code>git init</code>) needs to be connected to a GitHub repo for the first time.',
    how: 'Saves the remote\'s URL under a short name (conventionally "origin"), so future <code>git push</code>/<code>git pull</code> commands know where to send and fetch data without retyping the full URL.',
  },
};

const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.details-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.command-card');
    const commandName = card.dataset.command;
    const details = commandDetails[commandName];
    if (!details) return;

    modalBody.innerHTML = `
      <h3><code>${commandName}</code></h3>
      <pre class="modal-syntax"><code>${details.usage}</code></pre>
      <h4>When to use it</h4>
      <p>${details.when}</p>
      <h4>How it works</h4>
      <p>${details.how}</p>
    `;
    modalOverlay.classList.add('open');
  });
});

function closeModal() {
  modalOverlay.classList.remove('open');
}

modalClose.addEventListener('click', closeModal);

// Click on the dark backdrop (not the box itself) also closes the modal
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModal();
});

// Escape key closes the modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// =========================================================
// SCROLL-SPY
// Highlights the nav link for whichever section is
// currently in view as the user scrolls.
// =========================================================
const sections = document.querySelectorAll('main section[id]');
const navLinkElements = document.querySelectorAll('.nav-link');

const scrollSpyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');

        navLinkElements.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' } // triggers when section is near vertical center
);

sections.forEach((section) => scrollSpyObserver.observe(section));

// =========================================================
// SCROLL-REVEAL ANIMATIONS
// Adds a "visible" class to each section as it enters the
// viewport, triggering the fade/slide-in CSS transition.
// =========================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
