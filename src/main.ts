import __wbg_init,{ TokenizerBuilder,Tokenizer, getVersion } from 'lindera-wasm';

let tokenizer:Tokenizer | null = null;

__wbg_init().then(() => {
    console.log("WASM module initialized.");

    // Show the version in the title
    const version = getVersion();
    document.title = `Lindera WASM v${version}`;
    document.getElementById('title')!.textContent = `Lindera WASM v${version}`;

    // Initialize the tokenizer
    // Create a TokenizerBuilder instance
    let builder = new TokenizerBuilder();
    // Set the dictionary to "ipadic" (Japanese)
    // You can also use "ko-dic" (Korean) or "cc-cedict" (Chinese) as the dictionary
    builder.setDictionary("embedded://ipadic");

    // Set the tokenizer mode to "normal"
    // You can also use "decompose" for decomposing the compound words into their components
    builder.setMode("normal");

    // Append character filters
    builder.appendCharacterFilter("unicode_normalize", { "kind": "nfkc" });

    // Append token filters
    // builder.appendTokenFilter("lowercase");
    builder.appendTokenFilter("japanese_compound_word", {
        "kind": "ipadic",
        "tags": [
            "名詞,数"
        ],
        "new_tag": "名詞,数"
    });
    builder.appendTokenFilter("japanese_number", { "tags": ["名詞,数"] });

    // Build the Tokenizer instance
    tokenizer = builder.build();

    console.log("Tokenizer is ready.");
}).catch((e) => {
    console.error("Failed to initialize tokenizer:", e);
});



// Add an event listener to the "runButton" element
document.getElementById('runButton')!.addEventListener('click', () => {
    // If the tokenizer is not initialized yet, display an error message
    if (!tokenizer) {
        console.error("Tokenizer is not initialized yet.");
        return;
    }

    // Get the input text from the "inputText" element
    const inputText = (document.getElementById('inputText')! as HTMLInputElement).value;

    // Tokenize the input text
    const tokens = tokenizer.tokenize(inputText);

    // Get the "resultList" element
    const resultList = document.getElementById('resultList');

    // Clear the previous results
    resultList!.innerHTML = '';

    // Display the tokens
    console.log('All tokens:', tokens); // Log the entire tokens array

    tokens.forEach((token:any, index:number) => {
        const li = document.createElement('li');
        const pre = document.createElement('pre');

        console.log(`Token ${index}:`, token); // Log each individual token object

        pre.textContent = JSON.stringify(token, null, 2);
        li.appendChild(pre);

        resultList!.appendChild(li);
    });
});