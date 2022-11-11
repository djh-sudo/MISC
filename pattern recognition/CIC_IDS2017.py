"""
    This file is used to handle CIC-IDS2017 dataset
    @author: djh-sudo
    if you have any questions, pls contact me at
    djh113@126.com
"""

import os
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedShuffleSplit
from sklearn.preprocessing import normalize
from utils import *


exclusive_file = ['Monday', 'Thursday']
exclusive_class = ['Heartbleed']
label = ['BENIGN', 'Bot', 'DDoS', 'GoldenEye', 'Hulk', 'Slowhttp', 'slowloris', 'FTP-Patator', 'PortScan', 'SSH-Patator']


def handle_data(full_path: str):
    assert os.path.exists(full_path), 'path is not exist!'
    list_dir = os.listdir(full_path)
    fd_data = []
    # read all csv file
    for it in list_dir:
        if it.split('-')[0] in exclusive_file:
            continue
        data = pd.read_csv(os.path.join(full_path, it))
        fd_data.append(data)
    # concat data
    data = pd.concat([fd_data[0], fd_data[1]])
    for it in range(2, len(fd_data)):
        data = pd.concat([data, fd_data[it]])
    # drop some classes
    for it in exclusive_class:
        data = data[~data[' Label'].str.contains(it)]
    # drop the missing data
    data = data.replace([np.inf, -np.inf], np.nan, inplace=False)
    data = data.replace(',,', np.nan, inplace=False)
    data.replace("inf", 0.0, inplace=True)
    data.replace('Infinity', 0.0, inplace=True)
    data.replace('NaN', 0.0, inplace=True)
    data = data.dropna(axis=0, how='any')
    n_row, n_col = data.shape
    print('row:', n_row, 'col:', n_col)
    data.to_csv('./cache.csv', header=True)
    return data


def read_cache(inner_path):
    data = pd.read_csv(inner_path)
    return data


def sample(data):
    print(data[' Label'].value_counts())
    x_columns = data.columns.drop(' Label')
    x = data[x_columns].values
    print(x.shape)
    x = normalize(x, axis=0)
    dummies = pd.get_dummies(data[' Label'])
    y = dummies.values
    sss = StratifiedShuffleSplit(n_splits=1, test_size=0.3)
    for train_index, test_index in sss.split(x, y):
        x_train, x_test = x[train_index, :], x[test_index, :]
        y_train, y_test = y[train_index, :], y[test_index, :]
    # x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=20)
    return x_train, x_test, y_train, y_test


def c_execute(full_path: str):
    if os.path.exists('./cache.csv'):
        data = read_cache('./cache.csv')
    else:
        data = handle_data(full_path)
    x_train, x_test, y_train, y_test = sample(data)
    x_train, y_train = sub_resample(x_train, y_train, 5000)
    x_test, y_test = sub_resample(x_test, y_test, 300)
    return x_train, x_test, y_train, y_test


def main():
    c_execute('./data')


if __name__ == '__main__':
    main()
