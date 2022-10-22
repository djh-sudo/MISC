#include "mainwindow.h"
#include "ui_mainwindow.h"
#include"QTimer"
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    m_timer = new QTimer(this);
    m_persent = 0;
    connect(m_timer, SIGNAL(timeout()), this, SLOT(updateProgressbar()));
    m_timer->start(100);
    ui->bar4->startAnimation();
}

MainWindow::~MainWindow()
{
    delete ui;
}
void MainWindow::updateProgressbar()
{
    if(m_persent >= 100){
        ui->bar4->STOP();
        m_timer->stop();
        ui->bar4->close();

    }
    else{
        m_persent += 2;
    }
}

void MainWindow::on_pushButton_clicked()
{
    dialog=new Dialog();
    dialog->show();
}
