from mlxtend.classifier import StackingCVClassifier
from mlxtend.plotting import plot_decision_regions
from sklearn.model_selection import GridSearchCV
import itertools
import matplotlib.pyplot as plt


class Stacking(object):
    def __init__(self, classifier, meta, parameter, cross_validation=5):
        self.classifier = classifier
        self.meta = meta
        self.parameter = parameter
        self.sclf = StackingCVClassifier(classifiers=self.classifier,
                                         meta_classifier=self.meta,
                                         random_state=42)
        self.grid = GridSearchCV(estimator=self.sclf,
                                 param_grid=self.parameter,
                                 cv=cross_validation, refit=True,
                                 n_jobs=3)

    def fit(self, X, y):
        self.grid.fit(X, y)

    def best_parameter(self):
        return self.grid.best_params_

    def accuracy(self):
        return self.grid.best_score_

    def result(self):
        cv_keys = ('mean_test_score', 'std_test_score', 'params')
        for r, _ in enumerate(self.grid.cv_results_['mean_test_score']):
            print(f'{self.grid.cv_results_[cv_keys[0]][r]},'
                  f'{self.grid.cv_results_[cv_keys[1]][r] / 2.0},'
                  f'{self.grid.cv_results_[cv_keys[2]][r]}')
        return self.grid.cv_results_

    def graphics(self, x, y, all_model: list, all_model_name: list):
        all_model.append(self.sclf)
        all_model_name.append('StackingCVClassifier')
        feature_values = {i: 1 for i in range(2, 20)}
        feature_width = {i: 1 for i in range(2, 20)}
        for clf, lab, grd in zip(all_model, all_model_name, itertools.product([0, 1], repeat=2)):
            clf.fit(x, y)
            plot_decision_regions(X=x, y=y, clf=clf, filler_feature_values=feature_values,
                                  filler_feature_ranges=feature_width)
            plt.title(lab)
            plt.show()

    def predict(self, x):
        return self.grid.predict(x)
