from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from model.analysis import Analysis
import dotenv
import os

dotenv.load_dotenv()
IMAGES_PATH = os.path.join(os.getcwd(), os.getenv('IMAGES') if os.getenv('IMAGES') else 'images')
MAX_K = int(os.getenv('MAX_K')) if os.getenv('MAX_K') else 10
DEFAULT_K = int(os.getenv('DEFAULT_K')) if os.getenv('DEFAULT_K') else 5

app = FastAPI()
analysis = Analysis()

numeric = analysis.get_safe_feature_names_numeric()
nonnumeric = analysis.get_safe_feature_names_nonnumeric()

def get_image(image_name: str, file_type: str = 'png'):
    PATH = os.path.join(IMAGES_PATH, image_name) + f'.{file_type}'
    print(PATH)
    if not os.path.exists(PATH):
        raise HTTPException(status_code=404, detail="Heatmap image does not exist.")
    return open(PATH, 'rb')

@app.get("/")
def index():
    return {
        "message": "Welcome to the PAI_Project API.",
        "data_summary": '/data/summary',
        "features": '/data/features',
        "list_of_graphs": '/graphs',
    }

@app.get("/data/summary")
def get_data_summary():
    return {
        "columns": list(analysis.df.columns),
        "shape": list(analysis.df.shape),
        "description": analysis.df.describe().to_dict(),
        "head": analysis.df.head(5).to_dict()
    }

@app.get("/data/features")
def get_features():
    return {
        "numeric": numeric,
        "nonnumeric": nonnumeric,
    }

@app.get("/graphs")
def list_graphs():
    return {
        "message": "Visit these routes to get different graphs",
        "eda": {
            "numeric_features": {
                "heatmap": "/graphs/eda/heatmap",
                "boxplots": "/graphs/eda/boxplots/{feature_name}",
                "histograms": "/graphs/eda/histograms/{feature_name}",
            },
            "nonnumeric_features": {
                "countplots": "/graphs/eda/countplots/{feature_name}",
                "split-feature-countplots": "/graphs/eda/split/{feature_name}",
            }
        },
        "knn": {
            "confusion_matrix": "/graphs/knn/confusion",
            "classification_report": "/graphs/knn/classification",
            "roc_curve": "/graphs/knn/roc",
            "accuracy_vs_k": "/graphs/knn/acc_vs_k",
        }
    }

@app.get("/graphs/eda/heatmap")
def get_heatmap():
    return StreamingResponse(get_image('heatmap'), media_type="image/png")

@app.get("/graphs/eda/countplots/{feature}")
def get_countplots(feature: str):
    if feature not in nonnumeric:
        raise HTTPException(status_code=404, detail="Feature does not exist")
    return StreamingResponse(get_image(f'countplots_{feature}'), media_type="image/png")

@app.get("/graphs/eda/histplots/{feature}")
def get_histplots(feature: str):
    if feature not in numeric:
        raise HTTPException(status_code=404, detail="Feature does not exist")
    return StreamingResponse(get_image(f'histplots_{feature}'), media_type="image/png")

@app.get("/graphs/eda/boxplots/{feature}")
def get_histplots(feature: str):
    if feature not in numeric:
        raise HTTPException(status_code=404, detail="Feature does not exist")
    return StreamingResponse(get_image(f'boxplots_{feature}'), media_type="image/png")

@app.get("/graphs/eda/splitplots/{feature}")
def get_histplots(feature: str):
    if feature not in nonnumeric:
        raise HTTPException(status_code=404, detail="Feature does not exist")
    return StreamingResponse(get_image(f'splits_countplots_{feature}'), media_type="image/png")

@app.get("/graphs/knn/confusion")
def knn_confusion_matrix(k: int = DEFAULT_K):
    if not (0 < k <= MAX_K):
        raise HTTPException(status_code=400, detail=f"K out of range. Range=[1, {MAX_K}]")
    return StreamingResponse(get_image(f'knn_confusion_k{k}'), media_type="image/png")

@app.get("/graphs/knn/classification")
def knn_classification_report(k: int = DEFAULT_K):
    if not (0 < k <= MAX_K):
        raise HTTPException(status_code=400, detail=f"K out of range. Range=[1, {MAX_K}]")
    return StreamingResponse(get_image(f'knn_classification_k{k}'), media_type="image/png")

@app.get("/graphs/knn/roc")
def knn_classification_report(k: int = DEFAULT_K):
    if not (0 < k <= MAX_K):
        raise HTTPException(status_code=400, detail=f"K out of range. Range=[1, {MAX_K}]")
    return StreamingResponse(get_image(f'knn_roc_k{k}'), media_type="image/png")

@app.get("/graphs/knn/acc_vs_k")
def knn_classification_report():
    return StreamingResponse(get_image('knn_acc_vsk'), media_type="image/png")
