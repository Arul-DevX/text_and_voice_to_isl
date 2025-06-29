# 🧠 Text and Voice to Indian Sign Language Converter

A Flask-based application that converts text and voice input to Indian Sign Language (ISL) using SIGML animations and the Stanford Parser.

---

## ⚠️ UPDATE

**Stanford Parser is no longer accessible directly via URL.**  
Please follow these steps:

1. **Download** the [Stanford Parser ZIP manually](https://nlp.stanford.edu/software/lex-parser.html).
2. **Extract** it into the same directory where your `main.py` is located.
3. **Set the `JAVA_HOME` environment variable** to your JDK installation path.
4. **Add `%JAVA_HOME%\bin` to your system PATH.**

Refer to external guides on setting `JAVA_HOME` if you're unsure how to do this.

---

## 🔧 Installation

### Requirements

- Python 3.x
- Flask
- spaCy
- Stanza
- Java (for Stanford Parser)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/your-repo.git
    cd your-repo
    ```

2. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    pip install spacy
    ```

3. Run the app:

    ```bash
    python main.py
    ```

4. Open your browser and go to:

    ```
    http://127.0.0.1:5000/
    ```

---

## 📝 Note

- This project uses **SIGML** files to animate ISL signs.
- These files are manually created and **may not be 100% accurate**, as generating SIGML using **HamNoSys** is a complex and time-consuming process.

We welcome improvements or corrections to SIGML animations from the community.

---

## 💡 Credits

- [Stanza NLP](https://stanfordnlp.github.io/stanza/)
- [spaCy](https://spacy.io/)
- [SIGML](https://www.sign-lang.uni-hamburg.de/SignWriting/SigML.html)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

