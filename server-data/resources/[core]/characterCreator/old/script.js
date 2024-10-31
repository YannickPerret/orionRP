let currentStep = 1;

document.addEventListener("DOMContentLoaded", function () {
    updateStepUI();
    initializeSliders();
});

function updateStepUI() {
    document.querySelectorAll(".step").forEach((step, index) => {
        step.classList.toggle("hidden", index + 1 !== currentStep);
    });
    document.getElementById("step-title").textContent = `Step ${currentStep}: ${getStepTitle(currentStep)}`;
}

function getStepTitle(step) {
    switch (step) {
        case 1: return "DNA";
        case 2: return "Appearance & Hairiness";
        case 3: return "Facial Features";
        case 4: return "Clothing";
        default: return "";
    }
}

function nextStep() {
    if (currentStep < 4) {
        currentStep++;
        updateStepUI();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
}

function setGender(gender) {
    console.log(`Gender selected: ${gender}`);
    // Store gender selection here if needed
}

function confirmCharacter() {
    const characterData = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        height: document.getElementById("height").value,
        birthDate: document.getElementById("birth-date").value,
        // Additional data fields based on steps...
    };
    console.log("Character Data:", characterData);
    // Send data to server here
}

// Apply character skin based on current slider values
function applySkin() {
    const skinData = {
        hairStyle: document.getElementById("hair-style").value,
        hairPrimaryColor: document.getElementById("hair-primary-color").value,
        hairSecondaryColor: document.getElementById("hair-secondary-color").value,
        eyebrowStyle: document.getElementById("eyebrow-style").value,
        beardStyle: document.getElementById("beard-style").value,
        noseWidth: document.getElementById("nose-width").value,
        noseHeight: document.getElementById("nose-height").value,
        noseLength: document.getElementById("nose-length").value,
        eyebrowDepth: document.getElementById("eyebrow-depth").value,
        lipFullness: document.getElementById("lip-fullness").value,
        tshirtStyle: document.getElementById("tshirt-style").value,
        torsoStyle: document.getElementById("torso-style").value,
        legsStyle: document.getElementById("legs-style").value,
        shoesStyle: document.getElementById("shoes-style").value,
    };

    console.log("Applying skin changes:", skinData);

    fetch(`https://${GetParentResourceName()}/applySkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skinData)
    });
}


// Initialize sliders with event listeners to apply changes in real-time
function initializeSliders() {
    const sliders = document.querySelectorAll("input[type='range']");
    sliders.forEach(slider => {
        slider.addEventListener("input", () => {
            applySkin();  // Apply skin with the current values of all sliders
        });
    });
}
