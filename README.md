# Listing Lab — NYC Airbnb Room-Type Predictor

A machine learning web app that predicts an NYC Airbnb listing's room type — **Entire home/apt**, **Private room**, or **Shared room** — from its location, price, and host history.

**Backend:** FastAPI + scikit-learn (RandomForestClassifier)
**Frontend:** HTML/CSS/JS, built with Claude

---

## What it does

Given a listing's coordinates, borough, neighbourhood, price, and a few host/review signals, the model predicts the most likely room type along with a full probability breakdown across all three classes.

## Tech stack

| Layer | Tools |
|---|---|
| Model | scikit-learn `Pipeline` + `ColumnTransformer`, `RandomForestClassifier` |
| API | FastAPI, Pydantic |
| Frontend | HTML, CSS, vanilla JS |
| Data | [NYC Airbnb Open Data](https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data) via `kagglehub` |

## What I learned building this

- **Loading data with `kagglehub`** instead of manually downloading and re-uploading CSVs on every fresh environment.
- **Capping outliers with `.clip(upper_limit)`** instead of dropping rows — keeps the data point, just bounds its influence on the model.
- **`stratify=y` in `train_test_split`** — my room-type classes were imbalanced, and without stratification the test set didn't reflect the real class distribution.
- **Real `Pipeline` + `ColumnTransformer` usage** instead of manually preprocessing train/test separately (and risking data leakage).
- **`class_weight='balanced'`** in the classifier, so the model doesn't just default to predicting the majority class.

## Project structure

```
├── main.py                  # FastAPI backend
├── Model_Pipeline.pkl       # Trained sklearn pipeline
├── requirements.txt         # Python dependencies
├── .python-version          # Pinned Python version for deployment
├── index.html               # Frontend
├── style.css
├── script.js
└── NYC_AirBNB.ipynb          # Training notebook
```

## Running it locally

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the backend
uvicorn main:app --reload

# 3. Open index.html in your browser
# (it calls http://127.0.0.1:8000/predict by default)
```

## API

**POST** `/predict`

```json
{
  "latitude": 40.712776,
  "longitude": -73.935242,
  "price": 150,
  "minimum_nights": 3,
  "number_of_reviews": 24,
  "reviews_per_month": 1.4,
  "calculated_host_listings_count": 2,
  "availability_365": 180,
  "neighbourhood_group": "Brooklyn",
  "neighbourhood": "Williamsburg"
}
```

Response:

```json
{
  "Predicted room type": "Entire home/apt",
  "Probaility": [0.77, 0.22, 0.01]
}
```

## Deployment

Backend is set up for [Render](https://render.com). Deployment is a work in progress — currently debugging a Python version mismatch on the hosting environment (Render's default runtime doesn't yet have a prebuilt `pandas` wheel, so the build needs a pinned `.python-version`).

## Status

🚧 Actively being deployed and improved. Trained model and full local pipeline work end-to-end.

---

Built as a learning project — first end-to-end ML deployment attempt, first time using `Pipeline`/`ColumnTransformer` in a real project, and first time debugging a hosting-platform environment mismatch.
