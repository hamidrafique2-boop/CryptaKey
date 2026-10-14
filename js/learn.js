/* ============================================
   CryptaKey Learn & Privacy Center
   Educational content and data flow disclosure
   ============================================ */

(function() {
    'use strict';

    const CONTENT = {
        basics: `
            <h3>Passwords vs. Passphrases</h3>
            <p>A <strong>password</strong> is a string of characters used for authentication. A <strong>passphrase</strong> is a sequence of random words, typically longer and easier to remember while maintaining high entropy.</p>
            <h4>Why Passphrases Can Be Stronger</h4>
            <p>A passphrase like <em>"correct-horse-battery-staple"</em> has approximately 51 bits of entropy from a standard dictionary, but is far easier to memorize than a random 12-character password. The key is that each word must be chosen <strong>randomly</strong> from a large wordlist — not selected by a human, who tends to pick predictable words.</p>
            <h4>Best Practices</h4>
            <ul>
                <li><strong>Use a password manager</strong> to generate and store unique passwords for every account.</li>
                <li><strong>Never reuse passwords</strong> across different services. A breach on one site compromises all accounts using that password.</li>
                <li><strong>Enable multi-factor authentication (MFA)</strong> wherever available — even a strong password can be phished.</li>
                <li>Password length matters more than complexity rules. A 20-character lowercase password has more entropy than an 8-character mixed-case one.</li>
                <li>Avoid passwords based on personal information, common words, or keyboard patterns (e.g., "qwerty", "123456", birthdays).</li>
            </ul>
            <h4>References</h4>
            <ul>
                <li><a href="https://pages.nist.gov/800-63-4/sp800-63b.html" target="_blank" rel="noopener">NIST SP 800-63B Rev. 4 — Digital Identity Guidelines</a></li>
                <li><a href="https://www.eff.org/dice" target="_blank" rel="noopener">EFF Diceware Passphrase Wordlists</a></li>
            </ul>
        `,

        entropy: `
            <h3>Entropy & Password Strength</h3>
            <p><strong>Entropy</strong> measures the unpredictability of a password. It is expressed in bits: a password with N bits of entropy would require an attacker to try 2^N combinations on average to guess it by brute force.</p>
            <h4>How Entropy Is Calculated</h4>
            <p>For a <strong>randomly generated</strong> password of length L drawn uniformly from a character pool of size P:</p>
            <p><code>Entropy = L × log₂(P)</code></p>
            <p>For a <strong>passphrase</strong> of W randomly selected words from a wordlist of size D:</p>
            <p><code>Entropy = W × log₂(D)</code></p>
            <h4>Important Caveats</h4>
            <ul>
                <li>These formulas apply only to <strong>randomly generated</strong> passwords. Human-chosen passwords typically have far less entropy because people use predictable patterns.</li>
                <li><strong>Heuristic scoring</strong> (like zxcvbn) attempts to estimate real-world guessability by checking for dictionary words, sequences, repeated characters, keyboard patterns, and common substitutions.</li>
                <li><strong>Crack-time estimates</strong> are theoretical. In practice, password reuse, phishing, breach exposure, and the hashing algorithm used for storage all affect real security.</li>
                <li>A password that appears in a breach database can be cracked <strong>instantly</strong>, regardless of its entropy.</li>
            </ul>
            <h4>References</h4>
            <ul>
                <li><a href="https://github.com/dropbox/zxcvbn" target="_blank" rel="noopener">Dropbox zxcvbn — Realistic Password Strength Estimation</a></li>
            </ul>
        `,

        hashing: `
            <h3>Hashing, Salts & KDFs</h3>
            <h4>What Is a Hash Function?</h4>
            <p>A cryptographic hash function takes arbitrary input and produces a fixed-size output (the "digest"). It is a <strong>one-way</strong> function: you cannot recover the original input from the hash. This is different from encryption, which is reversible with a key.</p>
            <h4>Why Fast Hashes Are Bad for Passwords</h4>
            <p>General-purpose hash functions like SHA-256 are designed to be <strong>fast</strong>. An attacker with a GPU can compute billions of SHA-256 hashes per second, making brute-force attacks on hashed passwords feasible.</p>
            <h4>Password-Specific KDFs</h4>
            <p><strong>Key Derivation Functions</strong> (KDFs) are designed to be deliberately slow and memory-hard, making brute-force attacks expensive:</p>
            <ul>
                <li><strong>Argon2id</strong> — Winner of the Password Hashing Competition (2015). Recommended for new applications. Configurable memory, parallelism, and time cost.</li>
                <li><strong>bcrypt</strong> — Widely deployed, well-tested. Uses a cost factor to control iteration count.</li>
                <li><strong>scrypt</strong> — Memory-hard, making GPU attacks more expensive.</li>
                <li><strong>PBKDF2</strong> — Oldest, broadly available (including in browsers via Web Crypto). Less resistant to GPU attacks but acceptable with high iteration counts.</li>
            </ul>
            <h4>Salts</h4>
            <p>A <strong>salt</strong> is a random value added to each password before hashing. This ensures that identical passwords produce different hashes, preventing precomputed "rainbow table" attacks.</p>
            <h4>HMAC</h4>
            <p><strong>HMAC</strong> (Hash-based Message Authentication Code) combines a hash function with a secret key to produce an authentication tag. It verifies both the integrity and authenticity of a message. HMAC is not a password storage mechanism.</p>
            <h4>Encoding ≠ Encryption ≠ Hashing</h4>
            <ul>
                <li><strong>Encoding</strong> (e.g., Base64) transforms data for safe transport — it provides <em>no security</em> and is trivially reversible.</li>
                <li><strong>Encryption</strong> protects data using a key — the data can be recovered with the correct key.</li>
                <li><strong>Hashing</strong> produces a one-way fingerprint — the original data cannot be recovered.</li>
            </ul>
            <h4>References</h4>
            <ul>
                <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP Password Storage Cheat Sheet</a></li>
                <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" target="_blank" rel="noopener">MDN Web Crypto API</a></li>
            </ul>
        `,

        breaches: `
            <h3>Data Breaches & Password Reuse</h3>
            <h4>The Scale of the Problem</h4>
            <p>Billions of credentials have been exposed in data breaches. Attackers compile these into "combo lists" and use them in automated credential-stuffing attacks against other services. If you reuse the same password across sites, one breach compromises all your accounts.</p>
            <h4>How CryptaKey's Breach Check Works</h4>
            <ol>
                <li>Your password is hashed locally using SHA-1 (used only as a lookup index, not for security).</li>
                <li>Only the <strong>first 5 characters</strong> of the hash (out of 40) are sent to the Have I Been Pwned API.</li>
                <li>The API returns all hash suffixes that match that prefix (typically 500–1,000 entries).</li>
                <li>CryptaKey compares the remaining 35 characters <strong>locally</strong> to check for a match.</li>
                <li>Your password and its full hash <strong>never leave your browser</strong>.</li>
            </ol>
            <p>This technique is called <strong>k-anonymity</strong>. The <code>Add-Padding: true</code> header adds dummy entries to further prevent traffic analysis.</p>
            <h4>What the Results Mean</h4>
            <ul>
                <li><strong>"Found in N breaches"</strong> means this exact password appears in the HIBP corpus. Do not use it.</li>
                <li><strong>"Not found"</strong> means it was not in the database at the time of checking. This does <em>not</em> prove the password is safe — it may appear in breaches not yet catalogued.</li>
                <li><strong>"Could not check"</strong> means the network request failed. No conclusion can be drawn.</li>
            </ul>
            <h4>References</h4>
            <ul>
                <li><a href="https://haveibeenpwned.com/API/v3#PwnedPasswords" target="_blank" rel="noopener">Have I Been Pwned — Pwned Passwords API</a></li>
                <li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener">OWASP Top 10</a></li>
            </ul>
        `,

        privacy: `
            <h3>Privacy & Data Flow</h3>
            <p>CryptaKey is designed as a <strong>privacy-first</strong> application. All processing happens locally in your browser.</p>
            <h4>Data Flow Summary</h4>
            <table class="data-flow-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        <th>Processing</th>
                        <th>Network</th>
                        <th>Storage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Password Generator</td>
                        <td><span class="badge-local">Local</span></td>
                        <td>None</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>Strength Analyzer</td>
                        <td><span class="badge-local">Local</span></td>
                        <td>None</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>Breach Check</td>
                        <td><span class="badge-local">Local</span> hash</td>
                        <td><span class="badge-network">HIBP</span> — 5-char SHA-1 prefix only</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>Crack-Time Estimator</td>
                        <td><span class="badge-local">Local</span></td>
                        <td>None</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>Hash / KDF Lab</td>
                        <td><span class="badge-local">Local</span></td>
                        <td>None</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>Encoder / Decoder</td>
                        <td><span class="badge-local">Local</span></td>
                        <td>None</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>Theme preference</td>
                        <td>—</td>
                        <td>None</td>
                        <td>localStorage (theme only)</td>
                    </tr>
                </tbody>
            </table>
            <h4>What Is NOT Stored</h4>
            <ul>
                <li>Passwords, generated passwords, hashes, or tool inputs/outputs</li>
                <li>Cookies (none are used)</li>
                <li>Analytics or telemetry data (none is collected)</li>
                <li>Browser history entries beyond the URL hash for navigation</li>
            </ul>
            <h4>What IS Stored</h4>
            <ul>
                <li><strong>Theme preference</strong> (light/dark) in localStorage — contains no sensitive data</li>
            </ul>
            <h4>Third-Party Requests</h4>
            <ul>
                <li>The <strong>only</strong> outbound request is the optional breach check, which sends the first 5 characters of a SHA-1 hash to <code>api.pwnedpasswords.com</code>. This request requires explicit user action.</li>
                <li>No remote fonts, analytics, tracking pixels, ads, or CDN dependencies are loaded at runtime.</li>
            </ul>
            <h4>How to Clear State</h4>
            <p>Each tool has a "Clear" button that removes all input/output from the page. Navigating away from a tool clears its state. To remove the theme preference, clear your browser's localStorage for this site.</p>
        `
    };

    function init() {
        document.querySelectorAll('[data-learn]').forEach(tab => {
            tab.addEventListener('click', () => showTopic(tab.dataset.learn));
        });

        // Handle deep links from footer
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-learn-target]');
            if (link) {
                const topic = link.getAttribute('data-learn-target');
                // Navigate to learn section first
                setTimeout(() => showTopic(topic), 100);
            }
        });

        // Show default topic
        showTopic('basics');
    }

    function showTopic(topic) {
        const content = document.getElementById('learn-content');
        if (!content || !CONTENT[topic]) return;

        content.innerHTML = CONTENT[topic];

        // Update active tab
        document.querySelectorAll('[data-learn]').forEach(tab => {
            const isActive = tab.dataset.learn === topic;
            tab.classList.toggle('learn-tab--active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
