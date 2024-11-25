from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from model.analysis import Analysis
from starlette.requests import Request

app = FastAPI()
analaysis = Analysis()
analaysis.apply_knn()
numeric_features = analaysis.get_safe_feature_names_numeric()
nonnumeric_features = analaysis.get_safe_feature_names_nonnumeric()

@app.get('/')
def index():
    return {
        'message': 'Welcome to PAI_Project API',
        'routes': {
            'features': '/feature_info',
            'eda': {
                'numeric': [
                    '/eda/heatmap',
                    '/eda/histplots/{feature_name}',
                    '/eda/boxplots/{feature_name}',
                ],
                'non-numeric': [
                    '/eda/countplots/{feature_name}',
                    '/eda/split/countplots/{feature_name}'
                ]
            },
            'knn': {
                'confusion_matrix': '/knn/confusion',
                'classification_report': '/knn/classification',
                'roc_curve': '/knn/roc',
                'acc_vs_k': '/knn/vsk/{k}'
            }
        }
    }

@app.get('/feature_info')
def get_feature_info():
    return {
        'message': 'List of numeric and non-numeric features',
        'numeric': numeric_features,
        'non-numeric': nonnumeric_features
    }

@app.get('/eda/heatmap')
def get_heatmap():
    return StreamingResponse(analaysis.heatmap(), media_type='image/png')

@app.get('/eda/countplots/{feature_name}')
def get_countplot(feature_name: str):
    if feature_name not in nonnumeric_features:
        return JSONResponse(
            status_code=400,
            content={
                'message': 'Feature does not exist',
                'options': nonnumeric_features
            }
        )
    plots = analaysis.countplots()
    return StreamingResponse(plots[feature_name], media_type='image/png')

@app.get('/eda/histplots/{feature_name}')
def get_histplots(feature_name: str):
    if feature_name not in numeric_features:
        return JSONResponse(
            status_code=400,
            content={
                'message': 'Feature does not exist',
                'options': numeric_features
            }
        )
    plots = analaysis.histplots()
    return StreamingResponse(plots[feature_name], media_type='image/png')

@app.get('/eda/boxplots/{feature_name}')
def get_boxplots(feature_name: str):
    if feature_name not in numeric_features:
        return JSONResponse(
            status_code=400,
            content={
                'message': 'Feature does not exist',
                'options': numeric_features
            }
        )
    plots = analaysis.boxplots()
    return StreamingResponse(plots[feature_name], media_type='image/png')

@app.get('/eda/split/countplots/{feature_name}')
def get_split_countplots(feature_name: str):
    if feature_name not in nonnumeric_features:
        return JSONResponse(
            status_code=400,
            content={
                'message': 'Feature does not exist',
                'options': nonnumeric_features
            }
        )
    plots = analaysis.splitfeature_countplots()
    return StreamingResponse(plots[feature_name], media_type='image/png')

@app.get('/knn/confusion')
def get_confusion_matrix():
    return StreamingResponse(analaysis.knn_confusion_matrix(), media_type='image/png')

@app.get('/knn/classification')
def get_classification_report():
    return StreamingResponse(analaysis.knn_classification_report(), media_type='image/png')

@app.get('/knn/roc')
def get_roc_curve():
    return StreamingResponse(analaysis.knn_roc_curve(), media_type='image/png')

@app.get('/knn/vsk')
def get_acc_vs_k(k: int = 10):
    return StreamingResponse(analaysis.knn_accuracy_vs_k(k), media_type='image/png')

@app.exception_handler(Exception)
def global_exception_handler(req: Request, err: Exception):
    print(f"Unhandled error: {err}")
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred."},
    )