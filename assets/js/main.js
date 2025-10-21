fetch("../../partials/header.html")
.then(response => response.text())
.then(html => {
    document.body.insertAdjacentHTML("afterbegin", html);
    const navLinks = document.querySelectorAll("nav > ul > li > a, .dropdown-content a"); // Selects main navigation links and dropdown links
    highlightActivePage(navLinks); // Highlight active page on load
    setupSectionObserver(navLinks); // Pass navLinks to observer
})
.catch(err => {console.error("Failed loading header", err)});

function highlightActivePage(navLinks) {
    const currentPath = window.location.pathname; // Gets current page path ("about.html"...)
    const currentHash = window.location.hash; // Gets current URL hash ("#projects", ...)
    let projectParentLinkActivated = false; // Flag to track if the main "Projects" link has been activated

    navLinks.forEach(link => {
        link.removeAttribute("aria-current"); // Clears active state from all links

        const linkUrl = new URL(link.href); // Creates a URL object
        const linkPath = linkUrl.pathname; // Extracts path from link's href
        const linkHash = linkUrl.hash; // Extracts hash from link's href

        // Exact match for main nav links or dropdown links
        if (currentPath === linkPath && currentHash === linkHash) { // Checks for exact page or page+hash match
            link.setAttribute("aria-current", "page"); // Sets link as active
            // If a dropdown project link is active, also activate its parent "Projects" link
            if (link.closest(".dropdown-content")) { // Check if this link is inside a dropdown
                const parentDropdownButton = document.querySelector("nav > ul > li > a.dropdown-button[href*=\"#projects\"]"); // Finds the main "Projects" link
                if (parentDropdownButton) {
                    parentDropdownButton.setAttribute("aria-current", "true"); // Sets parent link as active
                    projectParentLinkActivated = true; // Mark parent as activated
                }
            }
        }
        // Special handling for project pages when on a project detail page
        // If currentPath starts with "projects/" and the link is the main "Projects" link
        else if (currentPath.startsWith("projects/") && linkPath.includes("index.html") && linkHash === "#projects" && !projectParentLinkActivated) { // Checks if current page is a project detail and this is the main "Projects" link
            link.setAttribute("aria-current", "true"); // Sets main "Projects" link as active (indicating a child project is active)
            projectParentLinkActivated = true; // Mark parent as activated
        }
    });
}

fetch("../../partials/footer.html")
.then(response => response.text())
.then(html => {
    document.body.insertAdjacentHTML("beforeend", html);
})
.catch(err => {console.error("Failed loading footer", err)});

function setupSectionObserver(navLinks) {
    const sections = document.querySelectorAll("section[id]"); // Selects all sections with an ID to observe

    const observerOptions = {
        threshold: 0.5 // Triggers when 50% of a section is visible
    };

    const observerCallback = (entries) => { // Function executed when a section's visibility changes
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Checks if the section is becoming visible
                navLinks.forEach(link => { // Clears active state from all links
                    link.removeAttribute("aria-current");
                });

                const id = entry.target.id; // Gets the ID of the visible section
                history.replaceState(null, "", `#${id}`); // Updates URL hash without reloading
                const activeLink = document.querySelector(`nav > ul > li > a[href*="${id}"]`); // Finds corresponding nav link
                if (activeLink) {
                    activeLink.setAttribute("aria-current", "page"); // Sets link as active
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions); // Creates IntersectionObserver

    sections.forEach(section => { // Starts observing each section
        observer.observe(section);
    });
}


const images = document.querySelectorAll(".project-image");

images.forEach(img => {
  img.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent click from propagating in the Document

    if (img.classList.contains("large")) {
      img.classList.remove("large");
    } else {
      images.forEach(i => i.classList.remove("large"));
      img.classList.add("large");
    }
  });
});

// remove large when clicking
document.addEventListener("click", () => {
  images.forEach(i => i.classList.remove("large"));
});