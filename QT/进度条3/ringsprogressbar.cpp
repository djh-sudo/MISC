#include "ringsprogressbar.h"
#include <QPainter>

RingsProgressbar::RingsProgressbar(QWidget *parent) : QWidget(parent),
    m_rotateAngle(0),
    m_persent(0)
{

}

void RingsProgressbar::setPersent(int persent)
{
    if(persent != m_persent)
    {
        m_persent = persent;
        update();
    }
}

void RingsProgressbar::paintEvent(QPaintEvent *)
{
    QPainter p(this);
    p.setRenderHint(QPainter::Antialiasing);

    m_rotateAngle = 360*m_persent/100;

    int side = qMin(width(), height());
    QRectF outRect(0, 0, side, side);
    QRectF inRect(20, 20, side-40, side-40);
    QString valueStr = QString("%1%").arg(QString::number(m_persent));

    //画外圆
    p.setPen(Qt::NoPen);
    p.setBrush(QBrush(QColor(97, 117, 118)));
    p.drawEllipse(outRect);
    p.setBrush(QBrush(QColor(255, 107, 107)));
    p.drawPie(outRect, (90-m_rotateAngle)*16, m_rotateAngle*16);
    //画遮罩
    p.setBrush(palette().window().color());
    p.drawEllipse(inRect);
    //画文字
    QFont f = QFont("Microsoft YaHei", 15, QFont::Bold);
    p.setFont(f);
    p.setFont(f);
    p.setPen(QColor("#555555"));
    p.drawText(inRect, Qt::AlignCenter, valueStr);
}
