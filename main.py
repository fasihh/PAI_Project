from model.analysis import Analysis


analysis = Analysis()
analysis.apply_knn()

all_plots = {
    'countplots': analysis.countplots(),
    'histplots': analysis.histplots(),
    'boxplots': analysis.boxplots(),
    'splits_countplots': analysis.splitfeature_countplots(),
    'heatmap': { 'heatmap': analysis.heatmap() },
    'confusion': { 'confusion': analysis.knn_confusion_matrix() },
    'classification': { 'classification': analysis.knn_classification_report() },
    'roc': { 'roc': analysis.knn_roc_curve() },
    'vsk': { 'vsk': analysis.knn_accuracy_vs_k() }
}

for plot_name in all_plots:
    for plot in all_plots[plot_name]:
        with open(f'{'images'}/{plot_name}_{plot}.png', 'wb') as f:
            f.write(all_plots[plot_name][plot].getvalue())