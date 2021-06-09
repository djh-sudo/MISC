function DSI = calDSI(SEG, GT)  
    % SEG, GT are the binary segmentation and ground truth areas, respectively.  
    % 计算DICE系数，即DSI  
    DSI = 2*double(sum(uint8(SEG(:) & uint8(GT(:))))) / double(sum(uint8(SEG(:))) + sum(uint8(GT(:))));  
end