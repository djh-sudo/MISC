# MATLAB-DSC-
MATLAB计算两张图像的`DSC`,`PPV`,`Sensitivity`等系数，常用于图像分割后的评估,并可视化展示
```Matlab
clc;
clear all;
close all;
raw_path = ''                           %原始图像文件夹
seg_path = '';                          %分割后的图像文件夹
gt_path = '';                           %Ground truth文件夹
imageSeg = dir(seg_path);               %加载图像,下同
numFiles = length(imageSeg);            %注意三个文件夹的图片数量要保持一致，名字保持一致
imageGt = dir(gt_path)
iamgeraw = dir(raw_path)
%%平均参数
avg_ppv = 0;%平均ppv
avg_sensitivity = 0;%平均sensitivity
avg_dis = 0;%平均dsc系数
avg_iou = 0;%平均iou


%%遍历文件夹
for i=3:numFiles                        %MATLAB中1 和 2 分别表示 . .. 
    S = strcat(seg_path,imageSeg(i).name)
    G = strcat(gt_path,imageGt(i).name)
    R = strcat(raw_path,iamgeraw(i).name)
    SEG = imread(S);
    GT = imread(G);
    im =imread(R);
    SEG = SEG(:,:,1);
    SEG = imbinarize(SEG);              % 二值化分割图像
    GT = imbinarize(GT);                %二值化分割图像
    GT_ = imcomplement(GT);             %背景和物体交换，便于计算背景的相关指标
    SEG_ = imcomplement(SEG);
    %%绘制
    %     figure(1),
    %     subplot(121),imshow(SEG);
    %     title('二值化后的分割图像');
    %     subplot(122),imshow(GT);
    %     title('二值化后的真值图像');
    %     figure(1);
    close all
    pause(0.5)
    %%去掉画图的边框，为了保存原始图像
    set(0,'DefaultFigureMenu','none');
    set(gca,'XTick',[]);
    set(gca,'YTick',[]);
    iptsetpref('ImshowBorder','tight');
    set(gca,'position',[0,0,1,1])
    %% 显示为伪色彩形式
    imagesc(SEG);
    saveas(gca,'path.jpg')              %暂存
    gfc = imread('path.jpg');           %读取
    s = size(im);
    gfc = imresize(gfc,[s(1) s(2)]);    %保持和原有图像一致大小，否则融合会失败
    result = imadd(0.5.*gfc,im);        %图像融合
    figure(1);
    imshow(result);
    figure(2);
    imshow(R);
    imwrite(result,iamgeraw(i).name);   %保存
    %% 计算各个评价指标
    
    % (1)计算DICE系数
    DSI = calDSI(SEG, GT);
    DSI_= calDSI(SEG_,GT_);
    fprintf('(1) DICE系数：        DSI       =  %.4f\n',DSI);
    
    % (2)计算VOE系数
    VOE = calVOE(SEG, GT);
    fprintf('(2) VOE系数：         VOE       =  %.4f\n',VOE);
    
    % (3)计算RVD系数
    RVD = calRVD(SEG, GT);
    fprintf('(3) RVD系数：         RVD       =  %.4f\n',RVD);
    
    % (4)计算Precision系数
    Precision = calPrecision(SEG, GT);
    fprintf('(4) Precision系数：   Precision =  %.4f\n',Precision);
    
    %（5）计算Recall系数
    Recall = calRecall(SEG, GT);
    fprintf('(5) Recall系数：      Recall    =  %.4f\n\n\n',Recall);
    
    disp('其他评价指标的计算');
    % (6)其他评价指标的计算
    % jaccard     = Jaccard_Index(SEG, GT)
    sensitivity = getSensitivity(SEG, GT)
    ppv = getPPV(SEG,GT)
    iou = DSI/(2-DSI)
    PPV_(i-2) = ppv;
    SEN_(i-2) = sensitivity;
    DISC(i-2) = DSI;
    IOU(i-2) = iou;
    avg_ppv = avg_ppv +ppv;
    avg_sensitivity = avg_sensitivity + sensitivity;
    avg_dis = avg_dis + DSI;
    avg_iou = iou + avg_iou;
    avg_dis_ = avg_dis_ + DSI_;
    miou = (DSI+DSI_)/2;
    MIOU(i-2) = miou;
    avg_miou = avg_miou + miou;
end
%%相关指标
avg_ppv = avg_ppv/(numFiles-2)                      % 平均PPV
avg_sensitivity = avg_sensitivity/(numFiles-2)      % 平均Sensitivity
avg_dis = avg_dis/(numFiles-2)                      % 平均DISC系数
avg_iou = avg_iou/(numFiles-2)                      % 平均iou
avg_miou = avg_miou/(numFiles-2)                    %  miou 即物体和背景的平均iou
avg = ones(1,50).*avg_miou;
%close all;
plot(MIOU,'LineWidth',2);
hold on;
plot(avg,'LineWidth',2);
grid on
xlabel('测试图像编号');
ylabel('mIOU');
title('测试结果');

plot(SEN_,'LineWidth',2);
hold on
plot(PPV_,'-','LineWidth',2);
hold on
plot(DISC,':','LineWidth',2)
grid on
legend('sensitivity','PPV','DSC')
xlabel('测试图像编号');
ylabel('结果');
title('测试结果');
```
