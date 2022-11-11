import numpy as np
from random import shuffle
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt


def self_shuffle(x, y):
    state = np.random.get_state()
    np.random.shuffle(x)
    np.random.set_state(state)
    np.random.shuffle(y)
    return x, y


def sub_resample(x, y, number=10000):
    x_data = {}
    y_label = {}
    ret_x, ret_y = [], []
    for i in range(len(x)):
        yn = np.argmax(y[i])
        if yn not in x_data:
            x_data[yn] = [x[i]]
            y_label[yn] = y[i]
        else:
            x_data[yn].append(x[i])
    for key in x_data:
        if len(x_data[key]) > number:
            shuffle(x_data[key])
            ret_x.extend(x_data[key][:number])
            for it in range(number):
                ret_y.append(y_label[key])
        else:
            ret_x.extend(x_data[key])
            for it in range(len(x_data[key])):
                ret_y.append(y_label[key])
            continue
    # random again
    for i in range(3):
        ret_x, ret_y = self_shuffle(ret_x, ret_y)
    return np.array(ret_x), np.array(ret_y)


def visual(x: np.array, y: np.array, class_number):
    x_tsne = TSNE(n_components=2, random_state=33).fit_transform(x)

    plt.style.use("dark_background")
    plt.figure(figsize=(8.5, 4))

    plt.scatter(x_tsne[:, 0], x_tsne[:, 1], c=y.argmax(axis=1), alpha=0.6,
                cmap=plt.cm.get_cmap('rainbow', class_number))
    plt.colorbar(ticks=range(class_number))
    plt.show()


def convert_T_SNE(x: np.array):
    x_tsne = TSNE(n_components=2, random_state=33).fit_transform(x)
    return x_tsne


def plot_matrix(cm, classes, title='', cmap=plt.cm.Blues):
    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)
    plt.ylim(len(classes) - 0.5, -0.5)
    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.title(title)
    plt.show()
