import time
from CIC_IDS2017 import c_execute
from sklearn.metrics import classification_report, accuracy_score
from sklearn.neighbors import KNeighborsClassifier
import sklearn.metrics as sm
from preprocess import p_execute
from KDD99 import k_execute
from UNSW_NB15 import u_execute
from utils import *
import CIC_IDS2017
import KDD99
import UNSW_NB15


def train_KNN(train_x, train_y, test_x, test_y, n=5):
    print('KNN training ...', n)
    t1 = time.time()
    knn = KNeighborsClassifier(n_neighbors=n)
    model = knn.fit(train_x, train_y)
    y_hat = model.predict(test_x)
    t2 = time.time()
    print('cost:', t2 - t1, 'sec')
    acc = accuracy_score(test_y, y_hat)
    print('acc', acc)
    report = classification_report(test_y, y_hat)
    print(report)
    print('--' * 20)
    # matrix = sm.confusion_matrix(test_y.argmax(axis=1), y_hat.argmax(axis=1))
    # plot_matrix(matrix, UNSW_NB15.label, 'UNSW_NB15')


def main():
    # x_train, x_test, y_train, y_test = c_execute('./data')
    x_train, x_test, y_train, y_test = k_execute('./KDD99/kddcup.data_10_percent_corrected')
    # x_train, x_test, y_train, y_test = u_execute('./UNSW-NB15/UNSW_NB15_training-set.csv',
    #                                              './UNSW-NB15/UNSW_NB15_testing-set.csv')
    spt = x_test.shape[0]
    x = np.vstack((x_train, x_test))
    y = np.vstack((y_train, y_test))
    x = p_execute(x, y)
    x_train, x_test = x[:-spt], x[-spt:]
    train_KNN(x_train, y_train, x_test, y_test, 5)


if __name__ == '__main__':
    main()
