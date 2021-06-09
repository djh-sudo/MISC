function sen = getSensitivity(SEG, GT)  
    % SEG, GT are the binary segmentation and ground truth areas, respectively.  
    % sensitivity  
    sen = double(sum(uint8(SEG(:) & GT(:)))) / double(sum(uint8(SEG(:))));  
end 
