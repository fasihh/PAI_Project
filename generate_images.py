from io import BytesIO
from model.analysis import Analysis
from tqdm import tqdm
import os
import dotenv

dotenv.load_dotenv()
IMAGES_PATH = os.path.join(os.getcwd(), os.getenv('IMAGES') if os.getenv('IMAGES') else 'images')
MAX_K = int(os.getenv('MAX_K')) if os.getenv('MAX_K') else 10
DEFAULT_K = int(os.getenv('DEFAULT_K')) if os.getenv('DEFAULT_K') else 5

analysis = Analysis()

def apply_knn(k: int) -> dict[str, BytesIO]:
    analysis.apply_knn(k)
    return {
        'confusion': analysis.knn_confusion_matrix(),
        'classification': analysis.knn_classification_report(),
        'roc': analysis.knn_roc_curve()
    }

all_plots = {}

with tqdm(total=7, desc="Generating all_plots") as pbar:
    all_plots['countplots'] = analysis.countplots()
    pbar.update(1)
    all_plots['histplots'] = analysis.histplots()
    pbar.update(1)
    all_plots['heatmap'] = analysis.heatmap()
    pbar.update(1)
    all_plots['boxplots'] = analysis.boxplots()
    pbar.update(1)
    all_plots['splits_countplots'] = analysis.splitfeature_countplots()
    pbar.update(1)
    all_plots['knn'] = [apply_knn(k) for k in range(1, MAX_K + 1)]
    pbar.update(1)
    all_plots['knn_acc_vsk'] = analysis.knn_accuracy_vs_k(MAX_K)
    pbar.update(1)

try:
    os.makedirs(IMAGES_PATH, exist_ok=True)

    for plot_name in tqdm(all_plots, desc="Saving plots"):
        plot_data = all_plots[plot_name]

        if isinstance(plot_data, dict):
            for plot in tqdm(plot_data, desc=f"Processing {plot_name}", leave=False):
                with open(f'{IMAGES_PATH}/{plot_name}_{plot}.png', 'wb') as f:
                    f.write(plot_data[plot].getvalue())
        elif isinstance(plot_data, list):
            for i, knn in enumerate(tqdm(plot_data, desc=f"Processing {plot_name}", leave=False)):
                for plot in knn:
                    with open(f'{IMAGES_PATH}/{plot_name}_{plot}_k{i+1}.png', 'wb') as f:
                        f.write(knn[plot].getvalue())
        elif isinstance(plot_data, BytesIO):
            with open(f'{IMAGES_PATH}/{plot_name}.png', 'wb') as f:
                f.write(plot_data.getvalue())

    print(f"All plots successfully saved to '{IMAGES_PATH}'")
except Exception as e:
    print('Failed to create images:', e)
