# Flashcard Web App

Interactive flashcard application for studying with spaced repetition.

## Features
- Load flashcard decks from CSV files
- Interactive card flipping
- Track study progress
- Mobile-friendly interface

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the app:
```bash
python app.py
```

3. Visit `http://localhost:5000`

## Deploy to Render

1. Push this repo to GitHub
2. Connect your GitHub repo to Render
3. Render will auto-detect the `render.yaml` configuration
4. Deploy!

## CSV Format

Place CSV files in the `data/` folder with this format:
```csv
question,answer
"What is Python?","A programming language"
"What is Flask?","A web framework"
```

## Tech Stack
- Backend: Flask (Python)
- Frontend: Vanilla JavaScript
- Hosting: Render
