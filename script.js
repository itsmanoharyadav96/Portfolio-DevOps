document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // INITIALIZE LUCIDE ICONS
    // ==========================================================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // MOBILE NAVIGATION MENU TOGGLE
    // ==========================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================================================
    // STICKY NAVBAR SCROLL ACTION
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // ACTIVE NAVIGATION LINK IN VIEWPORT
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNavLink = () => {
        const scrollPosition = window.scrollY + 160; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Trigger on load

    // ==========================================================================
    // GENERATE DYNAMIC GITHUB CONTRIBUTION GRID
    // ==========================================================================
    const githubGraph = document.getElementById('github-graph');
    
    if (githubGraph) {
        // Generate a grid of 168 boxes (24 columns x 7 rows)
        const totalBoxes = 168;
        
        // Distribution weights for commit activity levels
        // 0: None, 1: Low, 2: Medium, 3: High, 4: Very High
        const levels = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4];
        
        for (let i = 0; i < totalBoxes; i++) {
            const box = document.createElement('div');
            box.classList.add('github-grid-box');
            
            // Generate a random level biased towards active states
            const randomIndex = Math.floor(Math.random() * levels.length);
            const level = levels[randomIndex];
            box.classList.add(`level-${level}`);
            
            // Add a tooltip description on hover
            const commitCount = level === 0 ? 'No' : level * Math.floor(Math.random() * 3 + 1);
            const dateOffset = totalBoxes - i;
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - dateOffset);
            
            const dateString = targetDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            box.setAttribute('title', `${commitCount} commits on ${dateString}`);
            githubGraph.appendChild(box);
        }
    }

    // ==========================================================================
    // INTERSECTION OBSERVER FOR SCROLL REVEALS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a skill category card, animate the inner progress bars
                if (entry.target.classList.contains('skill-category-card')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        // Read width from style attribute and apply
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                }
                
                // If it is the github stats panel, run numbers counting animation
                if (entry.target.classList.contains('stats-panel')) {
                    const stats = entry.target.querySelectorAll('.stat-value');
                    stats.forEach(stat => {
                        const target = parseFloat(stat.getAttribute('data-target'));
                        const suffix = stat.textContent.includes('%') ? '%' : '';
                        animateValue(stat, 0, target, 2000);
                    });
                }
                
                // Once element is shown, unobserve it (one-time animation)
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% visible
        rootMargin: '0px 0px -50px 0px' // offset bottom triggers
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // NUMBER COUNTER ANIMATION FUNCTION
    // ==========================================================================
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Format numbers
            let current = progress * (end - start) + start;
            if (end % 1 !== 0) {
                // Float numbers
                obj.innerHTML = current.toFixed(1);
            } else {
                // Integers
                obj.innerHTML = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    // ==========================================================================
    // BACK TO TOP BUTTON CONTROL
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });

        // Initial styling
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // CONTACT FORM CLIENT-SIDE VALIDATION & SIMULATION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset validation states
            let isFormValid = true;
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('invalid'));

            // Check name
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Check email
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Check message
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            if (isFormValid) {
                // Change submit button state to loading
                formSubmitBtn.disabled = true;
                const originalBtnText = formSubmitBtn.innerHTML;
                formSubmitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader" class="animate-spin"></i>`;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Simulate mail server post request
                setTimeout(() => {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = originalBtnText;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }

                    // Show success status
                    formStatusMsg.textContent = "Thank you! Your message has been sent successfully.";
                    formStatusMsg.className = "form-status success";
                    
                    // Reset form fields
                    contactForm.reset();

                    // Clear status after 5 seconds
                    setTimeout(() => {
                        formStatusMsg.textContent = "";
                        formStatusMsg.className = "form-status";
                    }, 5000);

                }, 1500);
            }
        });
    }
});
