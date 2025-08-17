(function () { // wraps code (Immediately Invoked Function Expression)
    
    // getText function takes a css selector string and tries to find matching element
    const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : null; // return trimmed content if found or null if not found
    };

    const isWorkPage = !!document.querySelector("h2.title.heading");

    if (isWorkPage) {
        // You are on a work page

        // Check if user has left kudos
        // The kudos button has id "kudos"
        // When kudos is given, the button usually has class "kudos" and text "Thank you for leaving kudos!"
        const kudosButton = document.getElementById("kudos");
        const userLeftKudos = kudosButton 
            ? kudosButton.classList.contains("kudos") || kudosButton.textContent.toLowerCase().includes("Thank you for leaving kudos!")
            : false;

        // get data
        const data = {
            title: getText("h2.title.heading"),
            author: getText("a[rel='author']"),
            fandoms: [...document.querySelectorAll("dd.fandom.tags a")].map(el => el.textContent.trim()),
            tags: [...document.querySelectorAll("ul.tags.commas li a")].map(el => el.textContent.trim()),
            wordCount: parseInt(getText("dd.words")?.replace(/,/g, '') || "0"),
            userLeftKudos: userLeftKudos,
            dateRead: new Date().toISOString()
        };

    //save data to local storage
    // should also work under firefox and safari, but have to test (might have to change to Promise-based)
    chrome.storage.local.get({ works: [] }, (result) => {
            const works = result.works;
            const existing = works.find(
                (w) => w.title === data.title && w.author === data.author
            );

            // If work already exists in the log, update it
            if (existing) {
                existing.visitCount = (existing.visitCount || 1) + 1;
                existing.lastVisited = data.lastVisited;
                existing.userLeftKudos = existing.userLeftKudos || data.userLeftKudos; // update kudos if given later
            } else {
                works.push(data);
            }

            chrome.storage.local.set({ works });
            console.log("AO3 Work recorded:", data);
        });
    }

    else { // currently just showing browsing history
        // You are on a non-work page (e.g., search, browsing)
        const path = window.location.pathname;

        chrome.storage.local.get({ browsingHistory: [] }, (result) => {
            const history = result.browsingHistory;
            history.push({
                path: path,
                timestamp: new Date().toISOString()
            });

            chrome.storage.local.set({ browsingHistory: history });
            console.log("AO3 Browsing page visited:", path);
        });
    }
})();