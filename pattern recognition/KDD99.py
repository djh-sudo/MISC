"""
    This file is used to handle KDD99 datasets
    @author: djh-sudo
    if you have any questions, pls contact me at
    djh113@126.com
    Also See
    https://www.kaggle.com/code/pikaorange/kdd99-neuralnetwork
"""
import os
import pandas as pd
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.preprocessing import normalize

from utils import *

exclusive_class = ['spy.', 'perl.', 'phf.', 'multihop.', 'ftp_write.', 'loadmodule.', 'rootkit.', 'imap.',
                   'warezmaster.', 'land.', 'buffer_overflow.', 'guess_passwd.', 'nmap.', 'pod.']

label = ['back', 'ipsweep', 'neptune', 'normal', 'portsweep', 'satan', 'smurf', 'teardrop', 'warezclient']


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
    data = pd.read_csv(full_path, header=None)
    data_label = [
        'duration',  # [0, 58329]
        'protocol_type',  # TCP, UDP, ICMP
        'service',  # ‘http_443′,‘http_8001′,‘imap4′(70)
        'flag',  # ‘S0′,‘S1′,‘S2′(11)
        'src_bytes',  # [0,1379963888]
        'dst_bytes',  # [0,1309937401]
        'land',  # 0/1
        'wrong_fragment',  # [0,3]
        'urgent',  # [0,14]
        'hot',  # [0,101]
        'num_failed_logins',  # [0,5]
        'logged_in',  # 0/1
        'num_compromised',  # [0,7479]
        'root_shell',  # 0/1
        'su_attempted',  # 0/1
        'num_root',  # [0,7468]
        'num_file_creations',  # [0,100]
        'num_shells',  # [0,5]
        'num_access_files',  # [0,9]
        'num_outbound_cmds',  #
        'is_host_login',  # 0/1
        'is_guest_login',  # 0/1
        'count',  # [0,511]
        'srv_count',  # [0,511]
        'serror_rate',  # [0.00,1.00]
        'srv_serror_rate',  # [0.00,1.00]
        'rerror_rate',  # [0.00,1.00]
        'srv_rerror_rate',  # [0.00,1.00]
        'same_srv_rate',  # [0.00,1.00]
        'diff_srv_rate',  # [0.00,1.00]
        'srv_diff_host_rate',  # [0.00,1.00]
        'dst_host_count',  # [0,255]
        'dst_host_srv_count',  # [0,255]
        'dst_host_same_srv_rate',  # [0.00,1.00]
        'dst_host_diff_srv_rate',  # [0.00,1.00]
        'dst_host_same_src_port_rate',  # [0.00,1.00]
        'dst_host_srv_diff_host_rate',  # [0.00,1.00]
        'dst_host_serror_rate',  # [0.00,1.00]
        'dst_host_srv_serror_rate',  # [0.00,1.00]
        'dst_host_rerror_rate',  # [0.00,1.00]
        'dst_host_srv_rerror_rate',  # [0.00,1.00]
        'outcome'  # label
    ]
    data.columns = data_label.copy()
    data_type = [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                 0, 0, 0, 0, 0, 0, 0]
    for i in range(len(data_type)):
        val = data_type[i]
        if val == 0:
            encode_numeric_zscore(data, data_label[i])
        else:
            encode_text_dummy(data, data_label[i])

    data.dropna(inplace=True, axis=1)
    for it in exclusive_class:
        data = data[~data['outcome'].str.contains(it)]
    x_columns = data.columns.drop('outcome')
    x = data[x_columns].values
    dummies = pd.get_dummies(data['outcome'])  # 分类
    y = dummies.values
    print(data.outcome.value_counts())
    return x, y


def k_execute(full_path: str):
    x, y = handle_data(full_path)
    sss = StratifiedShuffleSplit(n_splits=1, test_size=0.31)
    for train_index, test_index in sss.split(x, y):
        x_train, x_test = x[train_index, :], x[test_index, :]
        y_train, y_test = y[train_index, :], y[test_index, :]
    x_train, y_train = sub_resample(x_train, y_train, 20000)
    x_test, y_test = sub_resample(x_test, y_test, 300)
    return x_train, x_test, y_train, y_test


def main():
    k_execute('./KDD99/kddcup.data_10_percent_corrected')


if __name__ == '__main__':
    main()
