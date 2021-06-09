function precision = calPrecision(SEG, GT)  
    % SEG, GT are the binary segmentation and ground truth areas, respectively.  
    % precision  
    precision = double(sum(uint8(SEG(:) & GT(:)))) / double(sum(uint8(SEG(:))));  
end
