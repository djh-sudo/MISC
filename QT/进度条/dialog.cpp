#include "dialog.h"
#include "ui_dialog.h"
#include"QTimer"
Dialog::Dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog)
{
    ui->setupUi(this);
    m_timer = new QTimer(this);
    m_persent = 0;
    connect(m_timer, SIGNAL(timeout()), this, SLOT(updateProgressbar()));
    m_timer->start(100);
    ui->bar4->startAnimation();
}
void Dialog::updateProgressbar()
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
Dialog::~Dialog()
{
    delete ui;
}
