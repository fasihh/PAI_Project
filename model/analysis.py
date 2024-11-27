from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import confusion_matrix, roc_curve, classification_report, roc_auc_score, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
import os
import pandas as pd
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO

class Analysis:
    def __init__(self):
        # load dataset with some values as NaN if they match the value inside the dict
        self.df: pd.DataFrame = \
            pd.read_csv(os.path.join(os.getcwd(), f'data\\adult.csv'),
                na_values={
                    'workclass': '?',
                    'occupation': '?',
                    'native.country': '?',
                    'capital.gain': 99999,
                }
            )
        
        self.__clean()
        self.numeric: list[str] = self.df.select_dtypes(include='number').columns
        self.nonnumeric: list[str] = self.df.select_dtypes(exclude='number').columns

        # label encoders for categorical features
        self.label_encoders: dict[str, LabelEncoder] = dict()

        self.scaler = StandardScaler()

        self.knn: KNeighborsClassifier | None = None
        self.X_test: pd.DataFrame | None = None
        self.y_test: pd.Series | None = None
        self.y_pred: np.ndarray | None = None
        self.y_prob: np.ndarray | None = None
        
        sns.set_theme()

    def __encode_features(self) -> pd.DataFrame:
        """
        Encode categorical features using LabelEncoder
        """
        df_encoded = self.df.copy()
        for feature in self.nonnumeric:
            le = LabelEncoder()
            df_encoded[feature] = le.fit_transform(df_encoded[feature])
            self.label_encoders[feature] = le
        return df_encoded
    
    def __get_safe_feature_names(self, features: list[str]) -> list[str]:
        def format(title: str) -> str:
            return title.replace('.', '_')
        return list(map(format, features))
    
    def get_safe_feature_names_numeric(self) -> list[str]:
        return self.__get_safe_feature_names(self.numeric)
    
    def get_safe_feature_names_nonnumeric(self) -> list[str]:
        return self.__get_safe_feature_names(self.nonnumeric)
    
    def apply_knn(self, k: int = 5, target: str = 'income') -> None:
        """
        Apply KNN over the features and store all results for later use
        """
        # get encoded df
        df_encoded = self.__encode_features()
        X = df_encoded.drop(columns=[target])
        y = df_encoded[target]

        X_scaled = self.scaler.fit_transform(X)

        X_train, self.X_test, y_train, self.y_test = train_test_split(
            X_scaled, y, test_size=0.3, random_state=42
        )

        self.knn = KNeighborsClassifier(n_neighbors=k)
        self.knn.fit(X_train, y_train)

        self.y_pred = self.knn.predict(self.X_test)
        self.y_prob = self.knn.predict_proba(self.X_test)[:, 1]

    def __formattitle(self, title: str) -> str:
        return title.replace('.', ' ').title()

    def __tobuffer(self) -> BytesIO:
        """
        Get the buffer of the graph generated before
        """
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        buffer.seek(0)
        plt.clf()
        return buffer
 
    def __clean(self) -> None:
        """
        Clean dataset
        """
        # drop any NaN values
        self.df.dropna(inplace=True)

        # drop fnlwgt
        self.df.drop('fnlwgt', axis=1, inplace=True)
        self.df.drop_duplicates(inplace=True)

        # removing 90 year olds working 40 hours per week
        self.df = self.df[~((self.df['age'] >= 90) & (self.df['hours.per.week'] == 40))]

    def heatmap(self) -> BytesIO:
        """
        Create heatmap of all numeric fields
        """
        sns.heatmap(self.df[self.numeric].corr(), annot=True)
        return self.__tobuffer()

    def countplots(self) -> dict[str, BytesIO]:
        """
        Create countplots of all categorical features
        """
        plots: dict[str, BytesIO] = dict()
        for feature in self.nonnumeric:
            sns.countplot(x=self.df[feature], order=self.df[feature].value_counts().index)
            plt.title(f'{self.__formattitle(feature)} Distribution')
            plt.xticks(rotation=90)
            plots[feature.replace('.', '_')] = self.__tobuffer()
        return plots
    
    def histplots(self, remove_zeros: bool = True) -> dict[str, BytesIO]:
        """
        Create dist plots of all numeric features. Give option to remove all 0 values from the feature
        """
        plots: dict[str, BytesIO] = dict()
        for feature in self.numeric:
            feature_data = self.df
            if remove_zeros:
                feature_data = self.df[self.df[feature] != 0]

            sns.histplot(data=feature_data, x=feature, kde=True, edgecolor=None, bins=15)
            plt.title(f'{self.__formattitle(feature)} Distribution')
            plots[feature.replace('.', '_')] = self.__tobuffer()
        return plots
    
    def boxplots(self, remove_zeros: bool = True) -> dict[str, BytesIO]:
        """
        Create box plots of all numeric features. Give option to remove all 0 values from the feature
        """
        plots: dict[str, BytesIO] = dict()
        for feature in self.numeric:
            feature_data = self.df
            if remove_zeros:
                feature_data = self.df[self.df[feature] != 0]

            sns.boxplot(data=feature_data, x=feature)
            plt.title(f'{self.__formattitle(feature)}')
            plots[feature.replace('.', '_')] = self.__tobuffer()
        return plots
    
    def splitfeature_countplots(self) -> dict[str, BytesIO]:
        """
        Create count plots of all categorical features split by income
        """
        plots: dict[str, BytesIO] = dict()
        for feature in self.nonnumeric:
            sns.countplot(data=self.df, x=feature, hue='income')
            plt.xticks(rotation=90)
            plots[feature.replace('.', '_')] = self.__tobuffer()
        return plots
    
    def knn_confusion_matrix(self) -> BytesIO:
        """
        Visualize the confusion matrix as heatmap
        """
        if not self.knn:
            raise ValueError("KNN not applied yet")
        
        cm = confusion_matrix(self.y_test, self.y_pred)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title("Confusion Matrix")
        plt.xlabel("Predicted")
        plt.ylabel("Actual")
        return self.__tobuffer()
    
    def knn_classification_report(self) -> BytesIO:
        """
        Visualize the classification report as heatmap
        """
        if not self.knn:
            raise ValueError("KNN not applied yet")

        report = classification_report(self.y_test, self.y_pred, output_dict=True)
        report_df = pd.DataFrame(report).T

        sns.heatmap(report_df.iloc[:-1, :-1], annot=True)
        plt.title("Classification Report")
        return self.__tobuffer()
    
    def knn_roc_curve(self) -> BytesIO:
        """
        Plot the ROC curve for binary classification
        """
        fpr, tpr, __ = roc_curve(self.y_test, self.y_prob)
        auc = roc_auc_score(self.y_test, self.y_prob)

        plt.plot(fpr, tpr, label=f"AUC = {auc:.2f}")
        plt.plot([0, 1], [0, 1], 'k--')
        plt.title("ROC Curve")
        plt.xlabel("False Positive Rate")
        plt.ylabel("True Positive Rate")
        plt.legend()
        return self.__tobuffer()

    def knn_accuracy_vs_k(self, max_k: int = 10) -> BytesIO:
        """
        Plot accuracy VS k to check model performance for different k values
        """
        accuracies = []
        df_encoded = self.__encode_features()
        X = df_encoded.drop(columns=['income'])
        y = df_encoded['income']
        X_scaled = self.scaler.fit_transform(X)
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42)

        for k in range(1, max_k + 1):
            knn = KNeighborsClassifier(n_neighbors=k)
            knn.fit(X_train, y_train)
            y_pred = knn.predict(X_test)
            accuracies.append(accuracy_score(y_test, y_pred))

        plt.plot(range(1, max_k + 1), accuracies, marker='o')
        plt.title("Accuracy vs. K")
        plt.xlabel("Number of Neighbors (K)")
        plt.ylabel("Accuracy")
        plt.grid()
        return self.__tobuffer()
