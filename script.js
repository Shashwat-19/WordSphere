const url = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value.trim();

    // Validate input
    if (!inpWord) {
        result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        return;
    }

    fetch(`${url}${inpWord}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data); // Debug the response

            const partOfSpeech = data[0]?.meanings[0]?.partOfSpeech || "N/A";
            const phonetic = data[0]?.phonetic || "N/A";
            const definition = data[0]?.meanings[0]?.definitions[0]?.definition || "Definition not available.";

            // Search for the first available example
            let example = "Example not available.";
            for (let meaning of data[0]?.meanings || []) {
                for (let def of meaning?.definitions || []) {
                    if (def?.example) {
                        example = def.example;
                        break;
                    }
                }
                if (example !== "Example not available.") break;
            }

            // Search for the first available audio
            const audio = data[0]?.phonetics.find((p) => p.audio)?.audio || "";

            result.innerHTML = `
                <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${partOfSpeech}</p>
                    <p>${phonetic}</p>
                </div>
                <p class="word-meaning">${definition}</p>
                <p class="word-example">${example}</p>
            `;

            // Update audio source
            if (audio) {
                sound.setAttribute("src", audio);
                console.log(`Audio URL: ${audio}`); // Debug the audio URL
                sound.load();
            } else {
                sound.removeAttribute("src");
                alert("No pronunciation audio available for this word.");
            }
        })
        .catch((error) => {
            console.error(error);
            result.innerHTML = `<h3 class="error">Word not found</h3>`;
        });
});

function playSound() {
    if (sound.getAttribute("src")) {
        sound.play();
    } else {
        alert("No pronunciation available for this word.");
    }
}
