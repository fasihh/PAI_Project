from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
from fastapi.responses import StreamingResponse, JSONResponse
from model.analysis import Analysis
import shutil
import os 

app = FastAPI()

# Initialize the Analysis object
analysis = Analysis(file_path="file.csv")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with a list of allowed origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    analysis.process_file()
    return {"message": "Welcome to the FastAPI Analysis API"}

# Route to get cleaned data summary
@app.get("/data/summary")
def get_data_summary():
    summary = {
        "head": analysis.df.head(5).to_dict(),
        "description": analysis.df.describe().to_dict(),
        "columns": list(analysis.df.columns),
    }
    return JSONResponse(content=summary)

@app.get("/graphs")
def list_graphs():
    graphs = {
        "heatmap": "/visual/heatmap",
        "countplots": "/visual/countplots",
        "boxplots": "/visual/boxplots",
        "histograms": "/visual/histograms",
        "split-feature-countplots": "/visual/split-feature-countplots",
        "knn_confusion_matrix": "/knn/confusion-matrix",
        "knn_classification_report": "/knn/classification-report",
        "knn_roc_curve": "/knn/roc-curve",
        "knn_accuracy_vs_k": "/knn/accuracy-vs-k",
    }
    return {"available_graphs": graphs}


# Route to get numeric and non-numeric feature names
@app.get("/features")
def get_features():
    return {
        "numeric": analysis.get_safe_feature_names_numeric(),
        "nonnumeric": analysis.get_safe_feature_names_nonnumeric(),
    }

# Route to generate and return a heatmap
@app.get("/visual/heatmap")
def generate_heatmap():
    buffer = analysis.heatmap()
    return StreamingResponse(buffer, media_type="image/png")

# Route to generate and return countplots for categorical features
@app.get("/visual/countplots")
def generate_countplots():
    plots = analysis.countplots()
    return {feature: f"/visual/plot/{feature}" for feature in plots.keys()}

@app.get("/visual/plot/{feature}")
def get_feature_plot(feature: str):
    plots = analysis.countplots()
    if feature not in plots:
        raise HTTPException(status_code=404, detail="Plot not found")
    return StreamingResponse(plots[feature], media_type="image/png")



# Route to apply KNN and evaluate results
@app.post("/knn")
def apply_knn(k: int = 5):
    try:
        analysis.apply_knn(k=k)
        return {"message": f"KNN applied with k={k}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to return confusion matrix
@app.get("/knn/confusion-matrix")
def knn_confusion_matrix():
    try:
        buffer = analysis.knn_confusion_matrix()
        return StreamingResponse(buffer, media_type="image/png")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Route to return classification report
@app.get("/knn/classification-report")
def knn_classification_report():
    try:
        buffer = analysis.knn_classification_report()
        return StreamingResponse(buffer, media_type="image/png")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Route to return ROC curve
@app.get("/knn/roc-curve")
def knn_roc_curve():
    try:
        buffer = analysis.knn_roc_curve()
        return StreamingResponse(buffer, media_type="image/png")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Route to return KNN accuracy vs. k
@app.get("/knn/accuracy-vs-k")
def knn_accuracy_vs_k(max_k: int = 10):
    try:
        buffer = analysis.knn_accuracy_vs_k(max_k=max_k)
        return StreamingResponse(buffer, media_type="image/png")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"data/{file.filename}"
    
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    df = pd.read_csv(file.file)
    analysis.update_dataframe(df)

    return {"info": f"File '{file.filename}' saved at '{file_location}'"}

@app.get("/download/{graph_name}/{file_format}")
def download_graph(graph_name: str, file_format: str):

    if file_format.lower() not in ["png", "pdf"]:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Generate the requested graph
    if graph_name == "heatmap":
        buffer = analysis.heatmap()
    else:
        raise HTTPException(status_code=404, detail="Graph not found")

    # Save the graph to a file
    file_name = f"{graph_name}_output"
    file_path = analysis.save_graph_to_file(buffer, file_name, file_format)

    # Return the saved file
    media_type = "application/pdf" if file_format.lower() == "pdf" else "image/png"
    return FileResponse(file_path, media_type=media_type, filename=f"{file_name}.{file_format}")