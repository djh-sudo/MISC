import pandas as pd
import os

from sklearn.model_selection import StratifiedShuffleSplit
from utils import *

exclusive_col = ['proto']
exclusive_class = ['Worms']
label = ['Analysis', 'Backdoor', 'DoS', 'Exploits', 'Fuzzers', 'Generic', 'Normal', 'Reconnaissance', 'Shellcode']


def encode_numeric_zscore(df, name, mean=None, sd=None):
    if mean is None:
        mean = df[name].mean()
    if sd is None:
        sd = df[name].std()
    df[name] = (df[name] - mean) / sd


def encode_text_dummy(df, name):
    dummies = pd.get_dummies(df[name])
    for x in dummies.columns:
        dummy_name = f"{name}-{x}"
        df[dummy_name] = dummies[x]
    df.drop(name, axis=1, inplace=True)


def handle_data(full_path: str):
    assert os.path.exists(full_path), 'path not exists!'
    data = pd.read_csv(full_path)
    data.drop(columns='id', inplace=True)
    # drop some classes
    for it in exclusive_class:
        data = data[~data['attack_cat'].str.contains(it)]
    data = data.replace([np.inf, -np.inf], np.nan, inplace=False)
    data = data.replace(',,', np.nan, inplace=False)
    data.replace("inf", 0.0, inplace=True)
    data.replace('Infinity', 0.0, inplace=True)
    data.replace('NaN', 0.0, inplace=True)
    data = data.dropna(axis=0, how='any')
    n_row, n_col = data.shape
    print('row:', n_row, 'col:', n_col)
    return data


def sample(data):
    data.drop(columns=exclusive_col, inplace=True)
    data_label = list(data.columns).copy()
    data_type = [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 1, 1, 0, 0, 0, 1]
    for i in range(len(data_type)):
        if data_type[i] == 0:
            encode_numeric_zscore(data, data_label[i])
        else:
            encode_text_dummy(data, data_label[i])
    print(data['attack_cat'].value_counts())
    x_columns = data.columns.drop(['label', 'attack_cat'])
    x = data[x_columns].values
    dummies = pd.get_dummies(data['attack_cat'])
    y = dummies.values
    sss = StratifiedShuffleSplit(n_splits=1, test_size=0.3)
    for train_index, test_index in sss.split(x, y):
        x_train, x_test = x[train_index, :], x[test_index, :]
        y_train, y_test = y[train_index, :], y[test_index, :]
    # x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=20)
    return x_train, x_test, y_train, y_test


def u_execute(train_path: str, test_path: str):
    train_data = handle_data(train_path)
    test_data = handle_data(test_path)
    data = pd.concat([train_data, test_data])
    x_train, x_test, y_train, y_test = sample(data)

    x_train, y_train = sub_resample(x_train, y_train, 5000)
    x_test, y_test = sub_resample(x_test, y_test, 300)
    return x_train, x_test, y_train, y_test


def main():
    u_execute('./UNSW-NB15/UNSW_NB15_training-set.csv', './UNSW-NB15/UNSW_NB15_testing-set.csv')


if __name__ == '__main__':
    main()
