import numpy as np
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.decomposition import FastICA
from sklearn.decomposition import FactorAnalysis
from CIC_IDS2017 import c_execute


# Low Variance Filter
def low_var_filter(x_data):
    reserve = []
    drop = []
    for it in range(x_data.shape[1]):
        var = np.std(x_data[:, it])
        if var <= 1e-6:
            drop.append(it)
        else:
            reserve.append(it)
    reserve = np.array(reserve)
    print('low var drop', drop)
    return x_data[:, reserve]


# Random Forest
def RF(x_data, y_label, n=20):
    model = RandomForestClassifier(random_state=0, n_estimators=500, n_jobs=-1)
    model.fit(x_data, y_label)
    importance = model.feature_importances_
    indices = np.argsort(importance)[::-1][: n]
    print('RF reserve', indices)
    return x_data[:, indices]


# Principal Component Analysis
def _PCA(x_data, threshold=0.98):
    pca = PCA(threshold)
    pca.fit(x_data)
    return pca.fit_transform(x_data)


# Independence Component Analysis
def _ICA(x_data, n=10):
    ica = FastICA(n_components=n, random_state=12)
    return ica.fit_transform(x_data)


# Factor Analysis
def FA(x_data, n=10):
    fa = FactorAnalysis(n_components=n).fit_transform(x_data)
    return fa


def p_execute(x_data, y_label, choose='RF'):
    x_data = low_var_filter(x_data)
    choose = choose.upper()
    if choose == 'RF':
        return RF(x_data, y_label)
    elif choose == 'PCA':
        return _PCA(x_data)
    elif choose == 'ICA':
        return _ICA(x_data)
    elif choose == 'FA':
        return FA(x_data)
    else:
        print('Warning! just low var filter')
        return x_data


def main():
    x_train, x_test, y_train, y_test = c_execute('./data')
    # x_train = RF(x_train, y_train)
    # print(x_train.shape)
    # x_train = low_var_filter(x_train)
    x_train = _ICA(x_train)
    print(x_train.shape)


if __name__ == '__main__':
    main()
