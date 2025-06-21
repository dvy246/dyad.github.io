const ADMIN_PASSWORD = 'yourStrongPassword123';

// Show/hide edit/upload buttons and contenteditable fields
function setAdminMode(isAdmin) {
    document.querySelectorAll('.edit-btn, .upload-btn').forEach(btn => {
        btn.style.display = isAdmin ? 'inline-block' : 'none';
    });
    document.querySelectorAll('.editable').forEach(field => {
        field.contentEditable = isAdmin;
        if (!isAdmin) field.blur();
    });
    // Toggle login/logout buttons
    document.getElementById('admin-login-btn').style.display = isAdmin ? 'none' : 'inline-block';
    document.getElementById('admin-logout-btn').style.display = isAdmin ? 'inline-block' : 'none';
}

// Admin login logic
document.getElementById('admin-login-btn').onclick = function() {
    const pwd = prompt('Enter admin password:');
    if (pwd === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        setAdminMode(true);
    } else {
        alert('Incorrect password.');
    }
};

document.getElementById('admin-logout-btn').onclick = function() {
    localStorage.removeItem('isAdmin');
    setAdminMode(false);
};

// On page load, check admin status
window.onload = function() {
    setAdminMode(localStorage.getItem('isAdmin') === 'true');
};
    

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });

    // Video Section Functions
    window.uploadVideo = function(input, videoId) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const videoElement = document.createElement('video');
            videoElement.controls = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            
            const fileURL = URL.createObjectURL(file);
            videoElement.src = fileURL;
            
            // Replace the image with the video
            const thumbnailContainer = document.querySelector(`#${videoId} .video-thumbnail`);
            const img = document.querySelector(`#${videoId}-img`);
            const playButton = document.querySelector(`#${videoId} .play-button`);
            
            if (thumbnailContainer && img && playButton) {
                thumbnailContainer.removeChild(img);
                thumbnailContainer.removeChild(playButton);
                thumbnailContainer.prepend(videoElement);
                
                // Hide the upload button after successful upload
                const uploadBtn = document.querySelector(`#${videoId} .upload-btn`);
                if (uploadBtn) {
                    uploadBtn.style.display = 'none';
                }
            }
        }
    };

    // Form submission (placeholder)
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a placeholder for actual form submission
            alert('Form submitted successfully! (This is a placeholder)');
            contactForm.reset();
        });
    }

    // Animate skill items when they come into view
    const skillItems = document.querySelectorAll('.skill-item');
    
    const animateOnScroll = function() {
        skillItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (itemPosition < screenPosition) {
                item.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load

    // Animate project cards when they come into view
    const projectCards = document.querySelectorAll('.project-card');
    
    const animateProjectCards = function() {
        projectCards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (cardPosition < screenPosition) {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 100); // Staggered animation
            }
        });
    };
    
    window.addEventListener('scroll', animateProjectCards);
    animateProjectCards(); // Run once on page load

    // Editable content functionality
    window.makeEditable = function(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Find all editable elements within this container
        const editableElements = element.querySelectorAll('.editable');
        
        // Toggle contenteditable attribute
        editableElements.forEach(el => {
            const isEditable = el.getAttribute('contenteditable') === 'true';
            el.setAttribute('contenteditable', !isEditable);
            
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.readOnly = isEditable;
                
                // If we're making it editable, change from hidden to text type
                if (!isEditable && el.tagName === 'INPUT') {
                    el.type = 'text';
                } else if (isEditable && el.tagName === 'INPUT') {
                    // When done editing, hide it again
                    el.type = 'hidden';
                }
            }
            
            if (!isEditable) {
                // Focus the first element when making editable
                if (el === editableElements[0]) {
                    el.focus();
                }
                
                // Add save functionality when pressing Enter or Escape
                el.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        el.blur();
                    } else if (e.key === 'Escape') {
                        el.blur();
                    }
                });
                
                // Save changes on blur
                el.addEventListener('blur', function() {
                    // You could add code here to save changes to a database
                    // For now, we'll just keep the changes in the DOM
                });
            }
        });
        
        // Change the edit button icon based on state
        const editBtn = element.querySelector('.edit-btn i');
        if (editBtn) {
            if (editableElements[0].getAttribute('contenteditable') === 'true') {
                editBtn.className = 'fas fa-save';
            } else {
                editBtn.className = 'fas fa-edit';
            }
        }
    };
    
    // Handle image uploads
    window.uploadImage = function(input, imgId) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(imgId).src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Open GitHub link from input field
window.openGitHub = function(inputId) {
    const githubUrl = document.getElementById(inputId).value;
    if (githubUrl && githubUrl.trim() !== '') {
        window.open(githubUrl, '_blank');
    } else {
        alert('Please enter a valid GitHub URL');
    }
};

// Function to open social media links
window.openSocialLink = function(inputId) {
    const input = document.getElementById(inputId);
    if (input && input.value) {
        // Check if the URL has a protocol, if not add https://
        let url = input.value;
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        window.open(url, '_blank');
    }
};

// Function to send email
window.sendEmail = function(inputId) {
    const input = document.getElementById(inputId);
    if (input && input.value) {
        window.location.href = 'mailto:' + input.value;
    }
};
    
    // Function to toggle the visibility of the 7th project card
    window.toggleProject7 = function() {
        const project7 = document.getElementById('project7');
        const addProjectBtn = document.getElementById('add-project');
        
        if (project7.classList.contains('hidden')) {
            project7.classList.remove('hidden');
            addProjectBtn.classList.add('hidden');
        } else {
            project7.classList.add('hidden');
            addProjectBtn.classList.remove('hidden');
        }
    };
});
