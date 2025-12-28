# Backend Files Structure (Python)

Create these files in a `backend/` folder:

## 1. Main Application (app.py)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from model.alzheimer_model import AlzheimerModel
from routes.api_routes import api_bp
from database.db_connection import init_db

app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

# Initialize model
model = AlzheimerModel()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## 2. CNN + LSTM Model (model/alzheimer_model.py)
```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    Input, Conv3D, MaxPooling3D, BatchNormalization,
    LSTM, Dense, Dropout, GlobalAveragePooling3D,
    Reshape, TimeDistributed, Flatten
)
import numpy as np

class AlzheimerModel:
    def __init__(self):
        self.model = self.build_hybrid_model()
        self.load_pretrained_weights()
    
    def build_hybrid_model(self):
        # CNN for spatial feature extraction
        input_shape = (64, 64, 64, 1)  # MRI scan dimensions
        inputs = Input(shape=input_shape)
        
        # 3D CNN layers
        x = Conv3D(32, (3,3,3), activation='relu', padding='same')(inputs)
        x = BatchNormalization()(x)
        x = MaxPooling3D((2,2,2))(x)
        
        x = Conv3D(64, (3,3,3), activation='relu', padding='same')(x)
        x = BatchNormalization()(x)
        x = MaxPooling3D((2,2,2))(x)
        
        x = Conv3D(128, (3,3,3), activation='relu', padding='same')(x)
        x = BatchNormalization()(x)
        x = GlobalAveragePooling3D()(x)
        
        # Reshape for LSTM (sequence processing)
        x = Reshape((1, 128))(x)
        
        # LSTM for temporal analysis
        x = LSTM(64, return_sequences=True)(x)
        x = LSTM(32)(x)
        x = Dropout(0.5)(x)
        
        # Classification layers
        x = Dense(64, activation='relu')(x)
        x = Dropout(0.3)(x)
        outputs = Dense(4, activation='softmax')(x)  # 4 classes
        
        model = Model(inputs=inputs, outputs=outputs)
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def predict(self, mri_data):
        # Preprocess and predict
        prediction = self.model.predict(mri_data)
        classes = ['Normal', 'Mild Cognitive Impairment', 'Moderate', 'Severe']
        
        confidence_scores = prediction[0]
        predicted_class = classes[np.argmax(confidence_scores)]
        
        return {
            'prediction': predicted_class,
            'confidence_scores': {
                classes[i]: float(confidence_scores[i]) 
                for i in range(len(classes))
            }
        }
```

## 3. API Routes (routes/api_routes.py)
```python
from flask import Blueprint, request, jsonify
import numpy as np
from werkzeug.utils import secure_filename
from utils.data_preprocessing import preprocess_mri
from model.alzheimer_model import AlzheimerModel

api_bp = Blueprint('api', __name__)
model = AlzheimerModel()

@api_bp.route('/upload', methods=['POST'])
def upload_mri():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Process MRI file
    processed_data = preprocess_mri(file)
    result = model.predict(processed_data)
    
    return jsonify(result)

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': True})
```

## 4. Run Commands:

### Frontend:
```bash
npm run dev
```

### Backend:
```bash
cd backend
pip install flask flask-cors tensorflow numpy nibabel scipy
python app.py
```

## Required Python Packages:
- flask
- flask-cors  
- tensorflow
- numpy
- nibabel (for MRI processing)
- scipy
- pandas
- mongodb/postgresql drivers