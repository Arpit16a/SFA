# SFA Project Setup with MongoDB and Machine Learning

This guide will walk you through setting up a SFA project with MongoDB and machine learning dependencies, as well as importing a MongoDB Compass database file.

## Prerequisites

- **Python** installed (preferably version 3.7+)
- **MongoDB** installed and running
- **MongoDB Compass** for database management

---

## Step 1: Set Up Project Directory

1. Create a directory for your project:
    ```bash
    mkdir sfa
    cd sfa
    ```

2. Initialize a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use: venv\Scripts\activate
    ```

## Step 2: Install Project Dependencies

### Required Packages

The following packages are essential for your project. We'll install them using `pip`:

- **Web Framework**: `Flask`, `Flask-SocketIO`, `Werkzeug`
- **Database and MongoDB**: `pymongo`, `Flask-PyMongo`, `dnspython`, `cloudinary`
- **Environment Variables**: `python-dotenv`
- **Data Manipulation and Analysis**: `numpy`, `pandas`, `scipy`, `pyarrow`
- **Machine Learning and NLP**:
  - **Core**: `scikit-learn`, `joblib`, `scikit-learn-intelex`
  - **Deep Learning**: `torch`, `torchvision`, `transformers`, `safetensors`, `huggingface-hub`
- **Data Visualization**: `matplotlib`
- **Text Processing and Utility**: `regex`, `schema`, `requests`, `packaging`, `python-socketio`, `python-dateutil`
- **Weather API**: `openmeteo_requests`, `openmeteo_sdk`
- **Additional ML Tools**: `neural_compressor`, `imbalanced-learn`, `imblearn`
- **Math Utilities**: `sympy`, `mpmath`
- **Image Processing**: `pillow`

### Installing Packages

Install the dependencies using the following command:
```bash
pip install Flask Flask-PyMongo pymongo scikit-learn numpy pandas python-dotenv joblib scipy scikit-learn-intelex schema requests regex python-socketio python-dateutil pymongo pyarrow pillow packaging openmeteo_requests openmeteo_sdk neural_compressor multidict mpmath matplotlib imblearn imbalanced-learn huggingface-hub Flask-SocketIO sympy torch torchvision transformers Werkzeug tokenizers safetensors dnspython cloudinary
```
