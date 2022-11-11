from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score
import numpy as np
import sklearn.metrics as sm
import CIC_IDS2017
import utils
from utils import visual
from stacking import Stacking
from CIC_IDS2017 import c_execute
from preprocess import p_execute
from KDD99 import k_execute
from UNSW_NB15 import u_execute


def base_model():
    clf1 = KNeighborsClassifier(n_neighbors=3)
    clf2 = RandomForestClassifier(random_state=42)
    clf3 = GaussianNB()
    clf4 = AdaBoostClassifier()
    clf5 = LogisticRegression(penalty='l2')
    return [clf1, clf2, clf3, clf4, clf5]


def base_model_name():
    return ['KNN', 'RF', 'GB', 'AB', 'LR']


def meta_model():
    clf1 = DecisionTreeClassifier()
    return clf1


def parameter():
    params = {'kneighborsclassifier__n_neighbors': [5, 9],
              'randomforestclassifier__n_estimators': [50, 100],
              'adaboostclassifier__n_estimators': [50],
              'adaboostclassifier__learning_rate': [0.1, 1],
              'logisticregression__C': [1, 0.1]
              }
    return params


def train(x, y):
    st = Stacking(classifier=base_model(),
                  meta=meta_model(),
                  parameter=parameter(),
                  )
    print('start training ...')
    st.fit(x, y)
    st.result()
    print('best parameter', st.best_parameter())
    print('acc', st.accuracy())
    return st


def test(x, y, st: Stacking):
    y_hat = st.predict(x)
    print(y_hat.shape)
    acc = accuracy_score(y.argmax(axis=1), y_hat)
    print('acc', acc)
    report = classification_report(y.argmax(axis=1), y_hat)
    print(report)
    matrix = sm.confusion_matrix(y.argmax(axis=1), y_hat)
    utils.plot_matrix(matrix, CIC_IDS2017.label, 'CIC-IDS2017')


def main():
    # load data
    x_train, x_test, y_train, y_test = c_execute('./data')
    # x_train, x_test, y_train, y_test = k_execute('./KDD99/kddcup.data_10_percent_corrected')
    # x_train, x_test, y_train, y_test = u_execute('./UNSW-NB15/UNSW_NB15_training-set.csv',
    #                                              './UNSW-NB15/UNSW_NB15_testing-set.csv')
    # preprocess
    spt = x_test.shape[0]
    x = np.vstack((x_train, x_test))
    y = np.vstack((y_train, y_test))
    x = p_execute(x, y)
    x_train, x_test = x[:-spt], x[-spt:]
    visual(x_test, y_test, 9)
    print('train shape', x_train.shape)
    model = train(x_train, y_train.argmax(axis=1))
    test(x_test, y_test, model)


if __name__ == '__main__':
    main()
