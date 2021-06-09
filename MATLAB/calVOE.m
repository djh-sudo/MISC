function VOE = calVOE(SEG, GT)  
    % SEG, GT are the binary segmentation and ground truth areas, respectively.  
    % 计算VOE系数，即VOE  
    VOE = 2*double(sum(uint8(SEG(:))) - sum(uint8(GT(:)))) / double(sum(uint8(SEG(:))) + sum(uint8(GT(:))));  
end
