# JAVA 多线程实现指针时钟
# 环境 IDEA
```java
import javax.swing.*;

import java.awt.*;
import java.util.Calendar;


public class Clock extends JFrame implements Runnable{
    public Thread clockThread;
    public Graphics mg;
    public Clock(){
        super("Digital Clock @copyright 2021 by DJH");
        setSize(520,400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        mg = this.getGraphics();
        clockThread = new Thread(this,"clock");
        clockThread.start();
    }
    @Override
    public void run() {
        Thread myThread = Thread.currentThread();
        while(clockThread == myThread){
            repaint();
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    public void paint(Graphics mg){
        super.paint(mg);
        mg = this.getGraphics();
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int second = calendar.get(Calendar.SECOND);
        String clockTime = new String(year+" 年 " + (month+1) + "月" + day + "日 " + hour + ":" + minute + ":" + second);

        Graphics2D g2d = (Graphics2D)mg;
        BasicStroke bs = new BasicStroke(6);
        g2d.setStroke(bs);

        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.setFont(new Font("DIALOG",Font.BOLD,30));
        g2d.drawString(clockTime,80,340);


        int x = 160;
        int y = 80;
        int width = 200;
        int height = 200;
        g2d.drawOval(x,y,width,height);

        int rx = x + width/2;
        int ry = y + height/2;

        int lengthSecond = 90;
        int thetaSecondX = (int) (rx + lengthSecond*Math.sin(second/30.0*Math.PI));
        int thetaSecondY = (int) (ry - lengthSecond*Math.cos(second/30.0*Math.PI));

        g2d.setColor(Color.ORANGE);
        g2d.drawLine(rx,ry,thetaSecondX,thetaSecondY);

        int lengthMinute = 65;
        int thetaMinuteX = (int) (rx + lengthMinute*Math.sin(minute/30.0*Math.PI));
        int thetaMinuteY = (int) (ry - lengthMinute*Math.cos(minute/30.0*Math.PI));
        
        g2d.setColor(Color.GRAY);
        g2d.drawLine(rx,ry,thetaMinuteX,thetaMinuteY);

        int lengthHour = 50;
        int thetaHourX = (int) (rx + lengthHour*Math.sin(hour/6.0*Math.PI));
        int thetaHourY = (int) (ry - lengthHour*Math.cos(hour/6.0*Math.PI));
        
        g2d.setColor(Color.GREEN);
        g2d.drawLine(rx,ry,thetaHourX,thetaHourY);

        calendar = null;
    }
    public static void main(String[] args) {
        Clock clock = new Clock();
        clock.setVisible(true);

    }
}
```

### annotation
* 1使用了多线程，同时使用了`GUI`，所以在只支持单继承的`JAVA`中，`extern JFrame implements Runnable`，继承了`JFrame`,只能通过实现`Runnable`接口去实现多线程;
* 2使用`Graphics2D g2d`的原因是可以有更加多元的设置样式方式，同时可以消除画面的锯齿;
* 3`Calendar.MONTH`的范围是`0-11`，所以需要手动加`1`,才能表示真实的月份;
* 4`drawOval`函数的`(x,y)`是圆(椭圆)的外接矩形的左上角顶点坐标

### deno
![](https://github.com/djh-sudo/MISC/blob/main/src/demo.gif)
